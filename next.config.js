const { withSentryConfig } = require('@sentry/nextjs');

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

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

module.exports = withMDX({
  env: {
    API_TAXI_PUBLIC_URL: readEnv('API_TAXI_PUBLIC_URL', 'http://localhost:5000'),
    REFERENCE_DOCUMENTATION_URL: readEnv('REFERENCE_DOCUMENTATION_URL', 'http://localhost:4999/doc/'),
    INTEGRATION_ENABLED: readEnvBool('INTEGRATION_ENABLED', 'true'),
    INTEGRATION_ACCOUNT_EMAIL: readEnv('INTEGRATION_ACCOUNT_EMAIL', 'neotaxi'),
  },

  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    // Redirect / to /dashboards
    defaultPathMap['/'] = {
      page: '/dashboards',
    };
    return defaultPathMap;
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
});

if (process.env.SENTRY_AUTH_TOKEN) {
  module.exports = withSentryConfig(module.exports, {silent: true});
}
