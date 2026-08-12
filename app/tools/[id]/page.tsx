import type { Metadata } from "next";
import siteData from "@/data/site-data.json";
import styles from "./tool-detail.module.css";

type Tool = (typeof siteData.cards)[number];
type Category = (typeof siteData.categories)[number];

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

const visibleTools = siteData.cards.filter((tool) => tool.visible !== false);
const toolsById = new Map(visibleTools.map((tool) => [String(tool.id), tool]));
const categoriesBySlug = new Map(
  siteData.categories.map((category) => [category.slug, category]),
);
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath =
  rawBasePath && rawBasePath !== "/"
    ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleTools.map((tool) => ({ id: String(tool.id) }));
}

function withBasePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    return path;
  }
  return `${basePath}${path}`;
}

function localImage(path: string) {
  return path.startsWith("/") && !path.startsWith("//")
    ? withBasePath(path)
    : withBasePath("/brand/favicon.png");
}

function officialUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return withBasePath(url);
  if (/^https?:\/\//i.test(url)) return url;
  return "#";
}

function officialDomain(url: string) {
  try {
    if (url.startsWith("/")) return "墨盒站内页面";
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "官网地址待核验";
  }
}

function subcategoryTitle(tool: Tool, category?: Category) {
  if (!tool.subcategorySlug || !category) return "";
  return (
    category.tabs.find((tab) => tab.slug === tool.subcategorySlug)?.title ?? ""
  );
}

function relatedTools(tool: Tool) {
  const sameSubcategory = visibleTools.filter(
    (candidate) =>
      candidate.id !== tool.id &&
      candidate.categorySlug === tool.categorySlug &&
      Boolean(tool.subcategorySlug) &&
      candidate.subcategorySlug === tool.subcategorySlug,
  );
  const prioritizedIds = new Set(sameSubcategory.map((candidate) => candidate.id));
  const sameCategory = visibleTools.filter(
    (candidate) =>
      candidate.id !== tool.id &&
      candidate.categorySlug === tool.categorySlug &&
      !prioritizedIds.has(candidate.id),
  );
  return [...sameSubcategory, ...sameCategory].slice(0, 6);
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = toolsById.get(id);
  if (!tool) return { title: "工具未找到" };

  const description = tool.description || `${tool.title} 的工具介绍与官网入口。`;
  return {
    title: tool.title,
    description,
    openGraph: {
      title: `${tool.title}｜墨盒`,
      description,
      images: [{ url: localImage(tool.imagePath), alt: `${tool.title} 图标` }],
    },
  };
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool = toolsById.get(id);

  if (!tool) {
    return (
      <main className={styles.page}>
        <section className={styles.missing}>
          <h1>工具未找到</h1>
          <p>该工具不存在，或暂未公开展示。</p>
          <a href={withBasePath("/")}>返回墨盒首页</a>
        </section>
      </main>
    );
  }

  const category = categoriesBySlug.get(tool.categorySlug);
  const categoryTitle = category?.title ?? tool.categorySlug;
  const subcategory = subcategoryTitle(tool, category);
  const related = relatedTools(tool);
  const destination = officialUrl(tool.url);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="面包屑" className={styles.breadcrumbs}>
          <a href={withBasePath("/")}>
            <ArrowLeftIcon />
            返回首页
          </a>
          <span aria-hidden="true">/</span>
          <a href={`${withBasePath("/")}#${tool.categorySlug}`}>
            {categoryTitle}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{tool.title}</span>
        </nav>

        <article className={styles.hero}>
          <div className={styles.identity}>
            {/* The dataset contains only localized public image paths. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${tool.title} 图标`}
              className={styles.logo}
              decoding="async"
              height="104"
              src={localImage(tool.imagePath)}
              width="104"
            />
            <div className={styles.heading}>
              <div className={styles.tags}>
                <span>{categoryTitle}</span>
                {subcategory && <span>{subcategory}</span>}
              </div>
              <h1>{tool.title}</h1>
              <p className={styles.domain}>{officialDomain(tool.url)}</p>
            </div>
          </div>

          <div className={styles.descriptionBlock}>
            <h2>工具介绍</h2>
            <p>{tool.description || "该工具的详细介绍正在整理中。"}</p>
          </div>

          <div className={styles.actionRow}>
            <a
              className={styles.primaryAction}
              href={destination}
              rel="noopener noreferrer"
              target={destination.startsWith("http") ? "_blank" : undefined}
            >
              访问官网
              <ExternalIcon />
            </a>
            <span>将前往第三方网站，请留意其服务条款与隐私政策。</span>
          </div>
        </article>

        <aside className={styles.notice}>
          <strong>使用提示</strong>
          <p>
            墨盒仅提供工具信息索引，不参与第三方网站的运营、收费或数据处理。使用前请自行核验官网域名、服务内容与账号安全。
          </p>
        </aside>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className={styles.relatedSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>继续探索</span>
                <h2 id="related-heading">同分类相关工具</h2>
              </div>
              <a href={`${withBasePath("/")}#${tool.categorySlug}`}>
                查看{categoryTitle}
              </a>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <a
                  className={styles.relatedCard}
                  href={withBasePath(`/tools/${item.id}/`)}
                  key={item.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${item.title} 图标`}
                    decoding="async"
                    height="48"
                    loading="lazy"
                    src={localImage(item.imagePath)}
                    width="48"
                  />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description || "查看工具介绍"}</small>
                  </span>
                  <ArrowLeftIcon />
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className={styles.footer}>
          <a href={withBasePath("/")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="墨盒小熊"
              height="42"
              src={localImage("/brand/mohe-bear.png")}
              width="42"
            />
            <span>
              <strong>墨盒</strong>
              <small>把实用 AI 工具装进一个盒子</small>
            </span>
          </a>
        </footer>
      </div>
    </main>
  );
}
