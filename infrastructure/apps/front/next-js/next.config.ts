import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pp-clca-pcm/domain",
    "@pp-clca-pcm/application",
  ],
};

export default nextConfig;
