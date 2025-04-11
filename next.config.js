/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'cms.anycar.vn'
      },
      {
        protocol: 'http',
        hostname: 'request', // Thay bằng hostname thực tế của bạn
        port: '', // Để trống nếu không có port
        pathname: '/**' // Cho phép tất cả các đường dẫn
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
