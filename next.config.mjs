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
  // By default only the .mdx extension is supported.
  extension: /\.mdx?$/,
  options: {
    /* providerImportSource: …, otherOptions… */
    providerImportSource: "@mdx-js/react",
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

  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId, _nextDefaultLocale }) {
    // Redirect / to /dashboards
    defaultPathMap['/'] = {
      page: '/dashboards',
    };
    return defaultPathMap;
  },

  // Support MDX files as pages:
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],

  sentry: {
    hideSourceMaps: true,
  },
};

let toExport = withMDX(nextConfig);

if (process.env.SENTRY_AUTH_TOKEN) {
  toExport = withSentryConfig(toExport, { silent: true });
}

export default toExport;