import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === 'production') {
  const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  Sentry.init({
    dsn: SENTRY_DSN || 'https://3652397b192141b2a0e8e6a6678c41c7@o481095.ingest.sentry.io/5736209',

    tracesSampleRate: 0.01,
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    });
}
