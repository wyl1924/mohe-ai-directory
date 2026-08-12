import type { Metadata } from "next";
import siteData from "@/data/site-data.json";
import {
  DirectoryApp,
  type DirectoryCard,
  type DirectoryCategory,
  type QuickLink,
} from "./components/DirectoryApp";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = rawBasePath && rawBasePath !== "/"
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";
const publicPath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  title: { absolute: "墨盒｜好用的 AI 工具，都在这里" },
  description:
    "墨盒 AI 工具导航，汇集写作、图片、视频、音频、编程、办公等实用人工智能工具。",
  icons: {
    icon: publicPath("/brand/favicon.png"),
    shortcut: publicPath("/brand/favicon.png"),
    apple: publicPath("/brand/favicon.png"),
  },
};

const categories = [...siteData.categories]
  .sort((a, b) => a.position - b.position) as DirectoryCategory[];
const cards = siteData.cards
  .filter((card) => card.visible !== false)
  .sort((a, b) => a.position - b.position) as DirectoryCard[];

const quickLinkRules = [
  { label: "DeepSeek", match: "deepseek-火遍全网 超强" },
  { label: "Kimi", match: "Kimi chat" },
  { label: "豆包", match: "豆包-免费ai生图" },
  { label: "文心一言", match: "文心一言" },
  { label: "Gemini", match: "Nano Banana pro" },
  { label: "Claude", match: "Claude Cowork" },
  { label: "LiblibAI", match: "LiblibAI-免费绘画/视频 超强" },
  { label: "即梦 AI", match: "即梦ai-最强免费视频生成" },
] as const;

const quickLinks: QuickLink[] = quickLinkRules.flatMap(({ label, match }) => {
  const card = cards.find((item) => item.title === match);
  return card
    ? [
        {
          title: label,
          url: card.url,
          imagePath: card.imagePath,
        },
      ]
    : [];
});

export default function Home() {
  return (
    <DirectoryApp
      cards={cards}
      initialCategories={categories}
      quickLinks={quickLinks}
    />
  );
}
