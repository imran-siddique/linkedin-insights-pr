/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_DATE__: string

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_DEBUG?: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}