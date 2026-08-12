import type { SVGProps } from "react";

export type IconName =
  | "arrow-up"
  | "book"
  | "briefcase"
  | "check"
  | "chevron"
  | "code"
  | "compass"
  | "external"
  | "fire"
  | "grid"
  | "home"
  | "image"
  | "layers"
  | "menu"
  | "moon"
  | "music"
  | "palette"
  | "search"
  | "settings"
  | "shield"
  | "sparkles"
  | "sun"
  | "users"
  | "video"
  | "x";

const paths: Record<IconName, React.ReactNode> = {
  "arrow-up": <path d="m18 15-6-6-6 6" />,
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  briefcase: (
    <>
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  code: (
    <>
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3" />
      <path d="m14 5-4 14" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5Z" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  fire: <path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4.5-8.5.2 2-1 3.4-2 4.2C12.2 7.5 10.6 4.5 8 2c.2 4-3 6.5-3 11 0 5 3 9 7 9Z" />,
  grid: (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  music: (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12Z" />
      <path d="M7.5 10h.01M9.5 6.5h.01M14 6h.01M17 9h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  sparkles: (
    <>
      <path d="m12 3-1.2 3.2L8 8l2.8 1.8L12 13l1.2-3.2L16 8l-2.8-1.8ZM5 14l-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8ZM19 12l-.8 2.2L16 15l2.2.8L19 18l.8-2.2L22 15l-2.2-.8Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  video: (
    <>
      <rect width="15" height="14" x="2" y="5" rx="2" />
      <path d="m17 10 5-3v10l-5-3Z" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
};

export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

export function categoryIcon(title: string): IconName {
  if (title.includes("热门")) return "fire";
  if (title.includes("图片")) return "image";
  if (title.includes("视频")) return "video";
  if (title.includes("音频")) return "music";
  if (title.includes("开发") || title.includes("编程") || title.includes("api"))
    return "code";
  if (title.includes("办公") || title.includes("求职")) return "briefcase";
  if (title.includes("设计")) return "palette";
  if (title.includes("搜索") || title.includes("检测")) return "search";
  if (title.includes("导航") || title.includes("竞赛")) return "compass";
  if (title.includes("社区") || title.includes("聊天")) return "users";
  if (title.includes("法律") || title.includes("算力")) return "shield";
  if (title.includes("学术") || title.includes("学习") || title.includes("资讯"))
    return "book";
  if (title.includes("模型") || title.includes("平台") || title.includes("框架"))
    return "layers";
  return "sparkles";
}
