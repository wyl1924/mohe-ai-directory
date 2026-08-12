import type { NextConfig } from "next";

export function resolvePagesBasePath(
  repository = "",
  customDomain = "",
) {
  const [repositoryOwner = "", repositoryName = ""] = repository.split("/");
  const isAccountRootSite =
    repositoryName.toLowerCase() ===
    `${repositoryOwner.toLowerCase()}.github.io`;

  return repositoryName && !isAccountRootSite && !customDomain.trim()
    ? `/${repositoryName}`
    : "";
}

const pagesBasePath = resolvePagesBasePath(
  process.env.GITHUB_REPOSITORY,
  process.env.GITHUB_PAGES_CUSTOM_DOMAIN,
);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
  },
};

export default nextConfig;
