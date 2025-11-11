import { BASE_PATH } from './lib/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
