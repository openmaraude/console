import { withSentryConfig } from '@sentry/nextjs';
import createMDX from "@next/mdx";
import remarkGfm from 'remark-gfm';

function readEnv(key, defaultValue) {
  const value = process.env[key];

  if (value !== undefined) {
    return value;
  }

  if (!defaultValue) {
    throw new Error(`Environment variable "${key}" is required.`);
  }

  console.warn(`~~~ Warning: default value "${defaultValue}" used for "${key}"`);
  return defaultValue;
}

function readEnvBool(key, defaultValue) {
  const value = readEnv(key, defaultValue);
  if (value && ['y', 'yes', '1', 't', 'true'].indexOf(value.toLowerCase()) != -1) {
    return true;
  }
  return false;
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm]
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  env: {
    API_TAXI_PUBLIC_URL: readEnv('API_TAXI_PUBLIC_URL', 'http://localhost:5000'),
    REFERENCE_DOCUMENTATION_URL: readEnv('REFERENCE_DOCUMENTATION_URL', 'http://localhost:4999/doc/'),
    INTEGRATION_ENABLED: readEnvBool('INTEGRATION_ENABLED', 'true'),
    INTEGRATION_ACCOUNT_EMAIL: readEnv('INTEGRATION_ACCOUNT_EMAIL', 'neotaxi'),
    // Same token for dev and prod
    MAPBOX_TOKEN: readEnv('MAPBOX_TOKEN', ''),
  },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboards',
        permanent: false,
      },
    ];
  },

  // Support MDX files as pages:
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
};

let toExport = withMDX(nextConfig);

if (process.env.SENTRY_AUTH_TOKEN) {
  toExport = withSentryConfig(toExport, { silent: true, hideSourceMaps: true });
}

export default withSentryConfig(toExport, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "openmaraude",
project: "console",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});