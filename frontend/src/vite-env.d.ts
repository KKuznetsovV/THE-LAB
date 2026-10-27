/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENT_URL: string;
  readonly VITE_IDENTITY_URL: string;
  readonly VITE_MEDIA_URL: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
