import {
  CreateBucketCommand,
  DeleteObjectCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  S3Client,
  type CORSConfiguration,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import config from 'config';
import { randomUUID } from 'crypto';

const MAX_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

interface MediaConfig {
  endpoint: string;
  publicEndpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  forcePathStyle: boolean;
}

function mediaConfig(): MediaConfig {
  return {
    endpoint: config.get<string>('media.endpoint'),
    publicEndpoint: config.get<string>('media.publicEndpoint'),
    region: config.get<string>('media.region'),
    bucket: config.get<string>('media.bucket'),
    accessKeyId: config.get<string>('media.accessKeyId'),
    secretAccessKey: config.get<string>('media.secretAccessKey'),
    publicBaseUrl: config.get<string>('media.publicBaseUrl').replace(/\/$/, ''),
    forcePathStyle: config.get<boolean>('media.forcePathStyle'),
  };
}

function clientFor(endpoint: string): S3Client {
  const media = mediaConfig();
  return new S3Client({
    region: media.region,
    endpoint,
    forcePathStyle: media.forcePathStyle,
    credentials: {
      accessKeyId: media.accessKeyId,
      secretAccessKey: media.secretAccessKey,
    },
  });
}

export function isMinioEndpoint(endpoint: string): boolean {
  return endpoint.includes('minio') || endpoint.includes(':9000') || endpoint.includes(':9200');
}

function publicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: '*',
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${bucket}/images/*`],
    }],
  });
}

const REAL_S3_CORS: CORSConfiguration = {
  CORSRules: [{
    AllowedOrigins: ['https://thelabtlv.com', 'https://www.thelabtlv.com'],
    AllowedMethods: ['POST', 'GET', 'HEAD'],
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3000,
  }],
};

export async function ensureMediaBucket(): Promise<void> {
  const media = mediaConfig();
  const client = clientFor(media.endpoint);
  try {
    await client.send(new CreateBucketCommand({ Bucket: media.bucket }));
    console.log(`Bucket ${media.bucket} created`);
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name !== 'BucketAlreadyOwnedByYou' && name !== 'BucketAlreadyExists') {
      throw error;
    }
  }
  await client.send(new PutBucketPolicyCommand({
    Bucket: media.bucket,
    Policy: publicReadPolicy(media.bucket),
  }));
  if (isMinioEndpoint(media.endpoint)) {
    console.log(`Skipping bucket CORS on MinIO (${media.endpoint}); only images/* is public`);
    return;
  }
  await client.send(new PutBucketCorsCommand({
    Bucket: media.bucket,
    CORSConfiguration: REAL_S3_CORS,
  }));
}

export function extensionFor(contentType: string): string | undefined {
  return MIME_TO_EXT[contentType];
}

export function objectKey(purpose: string, contentType: string): string {
  const ext = extensionFor(contentType);
  if (!ext) throw { status: 422, message: 'unsupported content type' };
  const year = new Date().getUTCFullYear();
  return `images/${purpose}/${year}/${randomUUID()}.${ext}`;
}

export function publicUrlFor(key: string): string {
  return `${mediaConfig().publicBaseUrl}/${key}`;
}

export async function presignUpload(key: string, contentType: string): Promise<{ url: string; fields: Record<string, string> }> {
  const media = mediaConfig();
  const signed = await createPresignedPost(clientFor(media.publicEndpoint), {
    Bucket: media.bucket,
    Key: key,
    Conditions: [
      ['content-length-range', 1, MAX_BYTES],
      ['eq', '$Content-Type', contentType],
      ['eq', '$key', key],
    ],
    Fields: {
      'Content-Type': contentType,
      key,
    },
    Expires: 300,
  });
  return { url: signed.url, fields: signed.fields };
}

export function assertDeletableKey(key: string): void {
  if (!key.startsWith('images/') || key.includes('..') || key.includes('\\')) {
    throw { status: 422, message: 'key must stay under images/' };
  }
}

export async function deleteObject(key: string): Promise<void> {
  const media = mediaConfig();
  await clientFor(media.endpoint).send(new DeleteObjectCommand({
    Bucket: media.bucket,
    Key: key,
  }));
}
