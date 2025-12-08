import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  experimental: {
    useCache: true,
    reactCompiler: true,
    ppr: false,
  },
};

export default nextConfig;
