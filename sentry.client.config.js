// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';

if (process.env.NODE_ENV === 'production') {
  const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  Sentry.init({
    integrations: [
      new Integrations.BrowserTracing(),
    ],
    dsn: SENTRY_DSN || 'https://3652397b192141b2a0e8e6a6678c41c7@o481095.ingest.sentry.io/5736209',
    tracesSampleRate: 0.01,
  });
}
