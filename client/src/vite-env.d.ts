/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

interface ImportMetaEnv {
  VITE_GRAPHQL_ENDPOINT: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_UPLOAD_ENABLED: string;
  VITE_GITHUB_URL: string;
  VITE_TELEGRAM_URL: string;
  VITE_LINKEDIN_URL: string;
  VITE_INSTAGRAM_URL: string;
  VITE_CONTACT_NAME: string;
  VITE_CONTACT_EMAIL: string;
  VITE_BASE_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
