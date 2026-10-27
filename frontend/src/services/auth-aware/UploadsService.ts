import axios, { type AxiosInstance } from 'axios';

export type UploadPurpose = 'cocktail' | 'bottle' | 'event' | 'gallery';

type Presign = {
  url: string;
  fields: Record<string, string>;
  key: string;
  publicUrl: string;
};

function isPresign(value: unknown): value is Presign {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  if (typeof row.url !== 'string' || typeof row.publicUrl !== 'string' || typeof row.key !== 'string') return false;
  if (typeof row.fields !== 'object' || row.fields === null) return false;
  return Object.values(row.fields).every((item) => typeof item === 'string');
}

export class UploadsService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async upload(file: File, purpose: UploadPurpose, onProgress: (ratio: number) => void): Promise<string> {
    const response = await this.http.post<unknown>('/api/uploads/presign', {
      contentType: file.type,
      purpose,
    });
    if (!isPresign(response.data)) throw new Error('upload failed');
    const body = new FormData();
    for (const [key, value] of Object.entries(response.data.fields)) body.append(key, value);
    body.append('file', file);
    await axios.post(response.data.url, body, {
      onUploadProgress: (event) => {
        if (event.total && event.total > 0) onProgress(event.loaded / event.total);
      },
    });
    return response.data.publicUrl;
  }
}
