/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const repoName = "PersonalPortfolio";

const nextConfig = {
  output: "export",
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
