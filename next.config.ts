import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['content/relocation-guide.pdf'],
  },
};

export default nextConfig;
