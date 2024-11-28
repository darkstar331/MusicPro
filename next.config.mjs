/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', // This allows all paths from lh3.googleusercontent.com
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**', // This allows all paths from avatars.githubusercontent.com
      },
      {
        protocol: 'https',
        hostname: 'misc.scdn.co',
        pathname: '/**', // This allows all paths from misc.scdn.co
      },
      {
        protocol: 'https',
        hostname: 'wrapped-images.spotifycdn.com',
        pathname: '/**', // This allows all paths from misc.scdn.co
      },
    ],
  },
};

export default nextConfig;
