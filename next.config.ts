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

// Bundle analyzer configuration
if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
