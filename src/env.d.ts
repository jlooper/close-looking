/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CLOUDINARY_CLOUD_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
