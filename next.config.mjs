/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    // Or alternatively using the older domains format:
    // domains: [
    //   'lh3.googleusercontent.com',
    //   'lh4.googleusercontent.com',
    //   'firebasestorage.googleapis.com'
    // ],
  },
};

export default nextConfig;