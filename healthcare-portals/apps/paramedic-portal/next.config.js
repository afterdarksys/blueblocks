/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@blueblocks/ui", "@blueblocks/auth", "@blueblocks/contracts"],
};
module.exports = nextConfig;
