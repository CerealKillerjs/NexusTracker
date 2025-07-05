import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Archivos de configuración eliminados
}

export const onRequestError = Sentry.captureRequestError; 