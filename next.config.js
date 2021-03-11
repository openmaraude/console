function readEnv(key, defaultValue) {
  const value = process.env[key];

  if (value) {
    return value;
  }

  if (!defaultValue) {
    throw new Error(`Environment variable "${key}" is required.`);
  }

  console.warn(`~~~ Warning: default value "${defaultValue}" used for "${key}"`);
  return defaultValue;
}

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

module.exports = withMDX({
  env: {
    API_TAXI_PUBLIC_URL: readEnv('API_TAXI_PUBLIC_URL', 'http://localhost:5000'),
    REFERENCE_DOCUMENTATION_URL: readEnv('REFERENCE_DOCUMENTATION_URL', 'http://localhost:4999/doc/'),
  },

  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/dashboards' },
    }
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
});
