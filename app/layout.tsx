import type { Metadata } from "next";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const [repositoryOwner, repositoryName] = repository;
const customDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN?.trim();
const isAccountSite =
  repositoryOwner && repositoryName === `${repositoryOwner}.github.io`;
const repositoryPath =
  !customDomain && repositoryOwner && repositoryName && !isAccountSite
    ? `/${repositoryName}`
    : "";
const siteUrl = customDomain
  ? `https://${customDomain}`
  : repositoryOwner
    ? `https://${repositoryOwner}.github.io${repositoryPath}`
    : "http://localhost:3000";
const description =
  "墨盒 AI 导航，收录国内外常用的写作、图片、视频、音频、编程与办公效率工具。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "墨盒｜好用的 AI 工具，都在这里",
    template: "%s｜墨盒",
  },
  description,
  keywords: ["AI 导航", "AI 工具", "AI 工具箱", "墨盒"],
  icons: {
    icon: `${repositoryPath}/brand/favicon.png`,
    shortcut: `${repositoryPath}/brand/favicon.png`,
    apple: `${repositoryPath}/brand/mohe-bear.png`,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "墨盒",
    title: "墨盒｜好用的 AI 工具，都在这里",
    description,
    url: siteUrl,
    images: [
      {
        url: `${repositoryPath}/og.png`,
        width: 1200,
        height: 630,
        alt: "墨盒 AI 工具导航",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "墨盒｜好用的 AI 工具，都在这里",
    description,
    images: [`${repositoryPath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
