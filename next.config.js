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
  publicRuntimeConfig: {
    API_TAXI_PUBLIC_URL: readEnv('API_TAXI_PUBLIC_URL', 'http://localhost:5000'),
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboards',
        permanent: true,
      },
    ]
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
});
