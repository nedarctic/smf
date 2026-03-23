import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  images: {
    domains: ['127.0.0.1']
  }
};

export default nextConfig;
