module.exports = {
  env: {
    API_TAXI_PUBLIC_URL: 'http://localhost:5000',
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
}
