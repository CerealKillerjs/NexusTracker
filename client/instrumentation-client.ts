import * as Sentry from "@sentry/nextjs";

export function register() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment:
        process.env.NODE_ENV === "production" ? "production" : "development",
    });
  }
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart; 