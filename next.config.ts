import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['content/relocation-guide.pdf'],
  },
  // Neighborhood URLs that changed when the data was aligned with the guide's nine neighborhoods.
  async redirects() {
    return [
      { source: '/neighborhoods/west-cary', destination: '/neighborhoods/cary', permanent: true },
      { source: '/neighborhoods/north-hills', destination: '/neighborhoods/north-raleigh', permanent: true },
      { source: '/neighborhoods/fuquay-varina', destination: '/neighborhoods', permanent: true },
    ];
  },
};

export default nextConfig;
