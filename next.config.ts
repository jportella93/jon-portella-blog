import type { NextConfig } from "next";
import { BASE_PATH } from "./lib/constants";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
