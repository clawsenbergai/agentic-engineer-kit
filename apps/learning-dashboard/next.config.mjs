/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@agentic/contracts"],
  experimental: {
    optimizePackageImports: ["react-markdown", "@supabase/supabase-js"]
  }
};

export default nextConfig;
