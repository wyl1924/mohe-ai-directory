"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon, categoryIcon } from "./Icons";

export interface DirectoryTab {
  position: number;
  slug: string;
  title: string;
}

export interface DirectoryCategory {
  id?: number;
  iconClass?: string;
  position: number;
  slug: string;
  tabs: DirectoryTab[];
  title: string;
}

export interface DirectoryCard {
  id?: number | string;
  sourceId?: string;
  categorySlug: string;
  subcategorySlug: string;
  title: string;
  description: string;
  url: string;
  detailUrl?: string;
  imagePath: string;
  position: number;
  visible?: boolean;
}

export interface QuickLink {
  title: string;
  url: string;
  imagePath: string;
}

interface DirectoryAppProps {
  cards: DirectoryCard[];
  initialCategories: DirectoryCategory[];
  quickLinks: QuickLink[];
}

const PREVIEW_LIMIT = 12;
const SECTION_PAGE_SIZE = 60;
const SEARCH_LIMIT = 60;

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = rawBasePath && rawBasePath !== "/"
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

function withBasePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    return path;
  }
  return `${basePath}${path}`;
}

const FALLBACK_IMAGE = withBasePath("/brand/favicon.png");

function safeImagePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//")
    ? withBasePath(path)
    : FALLBACK_IMAGE;
}

function safeToolUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return withBasePath(url);
  if (/^https?:\/\//i.test(url)) return url;
  if (/^[\w.-]+\.[a-z]{2,}(?:\/|$)/i.test(url)) return `https://${url}`;
  return "#";
}

function cardKey(card: DirectoryCard) {
  return `${card.id ?? card.sourceId ?? card.title}-${card.categorySlug}-${card.position}`;
}

function ToolImage({
  imagePath,
  title,
  eager = false,
}: {
  imagePath: string;
  title: string;
  eager?: boolean;
}) {
  return (
    // Dynamic paths are already-localized assets listed in the directory dataset.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${title} 图标`}
      decoding="async"
      height="44"
      loading={eager ? "eager" : "lazy"}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = FALLBACK_IMAGE;
      }}
      src={safeImagePath(imagePath)}
      width="44"
    />
  );
}

function ToolCard({ card }: { card: DirectoryCard }) {
  const officialUrl = safeToolUrl(card.url);
  const destination =
    card.id === undefined || card.id === null
      ? officialUrl
      : withBasePath(`/tools/${encodeURIComponent(String(card.id))}/`);

  return (
    <article className="tool-card" title={card.description || card.title}>
      <a className="tool-card-main" href={destination}>
        <span className="tool-icon">
          <ToolImage imagePath={card.imagePath} title={card.title} />
        </span>
        <span className="tool-copy">
          <strong>{card.title}</strong>
          <span>{card.description || "点击访问该工具"}</span>
        </span>
      </a>
      <a
        aria-label={`访问 ${card.title} 官网`}
        className="tool-detail"
        href={officialUrl}
        rel="noopener noreferrer"
        target="_blank"
        title="访问官网"
      >
        <Icon name="external" size={16} />
      </a>
    </article>
  );
}

function CardGrid({ cards }: { cards: DirectoryCard[] }) {
  return (
    <div className="tool-grid">
      {cards.map((card) => (
        <ToolCard card={card} key={cardKey(card)} />
      ))}
    </div>
  );
}

function CategorySection({
  cards,
  category,
}: {
  cards: DirectoryCard[];
  category: DirectoryCategory;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PREVIEW_LIMIT);
  const filteredCards = useMemo(
    () =>
      activeTab === "all"
        ? cards
        : cards.filter((card) => card.subcategorySlug === activeTab),
    [activeTab, cards],
  );
  const visibleCards = expanded
    ? filteredCards.slice(0, visibleCount)
    : filteredCards.slice(0, PREVIEW_LIMIT);

  const selectTab = (slug: string) => {
    setExpanded(false);
    setVisibleCount(PREVIEW_LIMIT);
    setActiveTab(slug);
  };

  const expandSection = () => {
    setExpanded(true);
    setVisibleCount(Math.min(SECTION_PAGE_SIZE, filteredCards.length));
  };

  const loadMore = () => {
    setVisibleCount((current) =>
      Math.min(current + SECTION_PAGE_SIZE, filteredCards.length),
    );
  };

  return (
    <section
      aria-labelledby={`${category.slug}-heading`}
      className="category-section"
      data-category-section={category.slug}
      id={category.slug}
      ref={sectionRef}
    >
      <div className="category-heading-row">
        <h2 id={`${category.slug}-heading`}>
          <span className="category-heading-icon">
            <Icon name={categoryIcon(category.title)} size={19} />
          </span>
          {category.title}
        </h2>
        <span className="category-count">{filteredCards.length} 个工具</span>
      </div>

      {category.tabs.length > 0 && (
        <div
          aria-label={`${category.title}分类筛选`}
          className="category-tabs"
          role="tablist"
        >
          <button
            aria-controls={`${category.slug}-panel`}
            aria-selected={activeTab === "all"}
            className={activeTab === "all" ? "is-active" : ""}
            onClick={() => selectTab("all")}
            role="tab"
            type="button"
          >
            全部
          </button>
          {category.tabs.map((tab) => (
            <button
              aria-controls={`${category.slug}-panel`}
              aria-selected={activeTab === tab.slug}
              className={activeTab === tab.slug ? "is-active" : ""}
              key={tab.slug}
              onClick={() => selectTab(tab.slug)}
              role="tab"
              type="button"
            >
              {tab.title}
            </button>
          ))}
        </div>
      )}

      <div
        aria-live="polite"
        id={`${category.slug}-panel`}
        role="tabpanel"
      >
        {visibleCards.length > 0 && <CardGrid cards={visibleCards} />}
        {visibleCards.length === 0 && (
          <div className="section-empty">
            <Icon name="search" size={22} />
            <span>该分类暂时没有可用工具</span>
          </div>
        )}
      </div>

      {filteredCards.length > PREVIEW_LIMIT && (
        <div className="section-actions">
          {expanded && visibleCards.length < filteredCards.length && (
            <button
              className="section-more"
              onClick={loadMore}
              type="button"
            >
              {`继续加载（${visibleCards.length}/${filteredCards.length}）`}
            </button>
          )}
          <button
            aria-expanded={expanded}
            className="section-more"
            onClick={expanded ? () => setExpanded(false) : expandSection}
            type="button"
          >
            {expanded ? "收起" : `展开全部（${filteredCards.length}）`}
            <Icon
              className={expanded ? "rotate-up" : ""}
              name="chevron"
              size={15}
            />
          </button>
        </div>
      )}
    </section>
  );
}

function QuickNavigation({ links }: { links: QuickLink[] }) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="quick-navigation-heading" className="quick-section">
      <div className="quick-heading">
        <h2 id="quick-navigation-heading">我的导航</h2>
        <span>常用 AI 工具</span>
      </div>
      <div className="quick-grid">
        {links.map((link) => (
          <a
            className="quick-card"
            href={safeToolUrl(link.url)}
            key={`${link.title}-${link.url}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="quick-icon">
              <ToolImage imagePath={link.imagePath} title={link.title} />
            </span>
            <strong>{link.title}</strong>
            <Icon name="external" size={14} />
          </a>
        ))}
      </div>
    </section>
  );
}

function SearchExperience({
  cards,
  onActiveChange,
}: {
  cards: DirectoryCard[];
  onActiveChange: (active: boolean) => void;
}) {
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(SEARCH_LIMIT);
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const allResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return cards.filter((card) =>
      `${card.title} ${card.description} ${card.categorySlug} ${card.subcategorySlug}`
        .toLocaleLowerCase("zh-CN")
        .includes(normalizedQuery),
    );
  }, [cards, normalizedQuery]);
  const results = allResults.slice(0, visibleCount);
  const suggestions = allResults.slice(0, 8);

  const updateQuery = (value: string) => {
    setQuery(value);
    setActiveSuggestion(-1);
    setVisibleCount(SEARCH_LIMIT);
    onActiveChange(Boolean(value.trim()));
  };

  const chooseSuggestion = (card: DirectoryCard) => {
    updateQuery(card.title);
    setFocused(false);
    window.setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      chooseSuggestion(suggestions[activeSuggestion]);
      return;
    }
    setFocused(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveSuggestion((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
    } else if (event.key === "Escape") {
      setFocused(false);
      setActiveSuggestion(-1);
    }
  };

  const loadMoreResults = () => {
    setVisibleCount((current) =>
      Math.min(current + SEARCH_LIMIT, allResults.length),
    );
  };

  return (
    <>
      <section aria-labelledby="search-heading" className="search-section">
        <div className="search-intro">
          <span className="search-kicker">发现趁手的 AI 工具</span>
          <h1 id="search-heading">墨盒 AI 工具导航</h1>
          <p>搜索、筛选并直达你需要的人工智能工具</p>
        </div>
        <div
          className="search-box-wrap"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocused(false);
            }
          }}
          ref={searchRef}
        >
          <form className="search-form" onSubmit={submitSearch} role="search">
            <Icon name="search" size={21} />
            <label className="sr-only" htmlFor="directory-search">
              搜索 AI 工具
            </label>
            <input
              aria-activedescendant={
                activeSuggestion >= 0
                  ? `search-suggestion-${activeSuggestion}`
                  : undefined
              }
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={focused && Boolean(normalizedQuery)}
              autoComplete="off"
              id="directory-search"
              onChange={(event) => updateQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleSearchKeys}
              placeholder="输入工具名称、功能或关键词"
              role="combobox"
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label="清空搜索"
                className="search-clear"
                onClick={() => updateQuery("")}
                type="button"
              >
                <Icon name="x" size={17} />
              </button>
            )}
            <button className="search-submit" type="submit">
              搜索
            </button>
          </form>

          {focused && normalizedQuery && (
            <div className="search-suggestions" id="search-suggestions" role="listbox">
              {suggestions.map((card, index) => (
                <button
                  aria-selected={activeSuggestion === index}
                  className={activeSuggestion === index ? "is-active" : ""}
                  id={`search-suggestion-${index}`}
                  key={cardKey(card)}
                  onClick={() => chooseSuggestion(card)}
                  role="option"
                  type="button"
                >
                  <span className="suggestion-icon">
                    <ToolImage imagePath={card.imagePath} title={card.title} />
                  </span>
                  <span>
                    <strong>{card.title}</strong>
                    <small>{card.description || "点击查看工具"}</small>
                  </span>
                  <Icon name="chevron" size={15} />
                </button>
              ))}
              {suggestions.length === 0 && (
                <div className="suggestion-status">没有匹配建议，试试更短的关键词</div>
              )}
            </div>
          )}
        </div>
      </section>

      {normalizedQuery && (
        <section
          aria-labelledby="search-results-heading"
          className="search-results category-section"
          ref={resultsRef}
        >
          <div className="category-heading-row search-results-heading">
            <h2 id="search-results-heading">
              <span className="category-heading-icon">
                <Icon name="search" size={19} />
              </span>
              “{query.trim()}” 的搜索结果
            </h2>
            <span aria-live="polite" className="category-count">
              {allResults.length} 个结果
            </span>
          </div>

          {results.length > 0 && <CardGrid cards={results} />}
          {results.length === 0 && (
            <div className="search-empty">
              <span className="empty-icon">
                <Icon name="search" size={28} />
              </span>
              <h3>暂时没有找到相关工具</h3>
              <p>试试工具名称、用途，或使用更短的关键词。</p>
              <button onClick={() => updateQuery("")} type="button">
                查看全部分类
              </button>
            </div>
          )}
          {results.length < allResults.length && (
            <div className="section-actions">
              <button
                className="section-more"
                onClick={loadMoreResults}
                type="button"
              >
                {`加载更多（${results.length}/${allResults.length}）`}
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export function DirectoryApp({
  cards,
  initialCategories,
  quickLinks,
}: DirectoryAppProps) {
  const mobileMenuRef = useRef<HTMLButtonElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | undefined>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    initialCategories[0]?.slug ?? "",
  );
  const [searchActive, setSearchActive] = useState(false);

  const cardsByCategory = useMemo(
    () => {
      const grouped = new Map<string, DirectoryCard[]>();
      cards.forEach((card) => {
        const categoryCards = grouped.get(card.categorySlug) ?? [];
        categoryCards.push(card);
        grouped.set(card.categorySlug, categoryCards);
      });
      return grouped;
    },
    [cards],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage.getItem("mohe-theme");
      setTheme(
        savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
      );
      setCollapsed(window.localStorage.getItem("mohe-sidebar") === "collapsed");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchActive) return;
    const sections = document.querySelectorAll<HTMLElement>("[data-category-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const slug = visible?.target.getAttribute("data-category-section");
        if (slug) setActiveCategory(slug);
      },
      { rootMargin: "-90px 0px -72% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [initialCategories, searchActive]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        mobileMenuRef.current?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(
        "mohe-sidebar",
        next ? "collapsed" : "expanded",
      );
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("mohe-theme", next);
      return next;
    });
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div
      className={`directory-shell${collapsed ? " sidebar-collapsed" : ""}${drawerOpen ? " drawer-open" : ""}`}
      data-theme={theme}
      id="top"
    >
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <button
        aria-label="关闭分类菜单"
        className="drawer-scrim"
        onClick={closeDrawer}
        tabIndex={drawerOpen ? 0 : -1}
        type="button"
      />
      <aside aria-label="工具分类导航" className="sidebar">
        <div className="sidebar-brand">
          <a aria-label="返回墨盒首页" href="#top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="墨盒小熊 Logo"
              height="52"
              src={safeImagePath("/brand/mohe-bear.png")}
              width="52"
            />
            <span>
              <strong>墨盒</strong>
              <small>AI 工具导航</small>
            </span>
          </a>
          <button
            aria-label="关闭分类菜单"
            className="drawer-close"
            onClick={closeDrawer}
            type="button"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {initialCategories.map((category) => (
              <li key={category.slug}>
                <a
                  aria-current={activeCategory === category.slug ? "location" : undefined}
                  className={activeCategory === category.slug ? "is-active" : ""}
                  href={`#${category.slug}`}
                  onClick={() => {
                    setActiveCategory(category.slug);
                    closeDrawer();
                  }}
                  title={collapsed ? category.title : undefined}
                >
                  <Icon name={categoryIcon(category.title)} size={19} />
                  <span>{category.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      <div className="page-column">
        <header className="top-header">
          <button
            aria-label="打开分类菜单"
            aria-expanded={drawerOpen}
            className="mobile-menu-button"
            onClick={() => setDrawerOpen(true)}
            ref={mobileMenuRef}
            type="button"
          >
            <Icon name="menu" size={22} />
          </button>
          <button
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
            aria-pressed={collapsed}
            className="sidebar-toggle"
            onClick={toggleSidebar}
            type="button"
          >
            <Icon name="menu" size={21} />
          </button>
          <a aria-current="page" className="header-link is-current" href="#top">
            <Icon name="home" size={18} />
            首页
          </a>
          <a aria-label="墨盒首页" className="mobile-brand" href="#top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              height="38"
              src={safeImagePath("/brand/mohe-bear.png")}
              width="38"
            />
            <strong>墨盒</strong>
          </a>
          <div className="header-spacer" />
          <span className="tool-total">
            <Icon name="grid" size={16} />
            {cards.length.toLocaleString("zh-CN")} 个工具
          </span>
          <button
            aria-label={theme === "dark" ? "切换到日间模式" : "切换到夜间模式"}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
          </button>
        </header>

        <main id="main-content">
          <div className="content-container">
            <SearchExperience
              cards={cards}
              onActiveChange={setSearchActive}
            />
            <QuickNavigation links={quickLinks} />

            {!searchActive && (
              <div aria-label="AI 工具分类" className="category-list">
                {initialCategories.map((category) => (
                  <CategorySection
                    cards={cardsByCategory.get(category.slug) ?? []}
                    category={category}
                    key={category.slug}
                  />
                ))}
              </div>
            )}

            <footer className="site-footer">
              <div className="footer-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="墨盒小熊"
                  height="48"
                  src={safeImagePath("/brand/mohe-bear.png")}
                  width="48"
                />
                <span>
                  <strong>墨盒</strong>
                  <small>把实用 AI 工具装进一个盒子</small>
                </span>
              </div>
              <p>本站提供第三方工具信息索引，访问和使用前请自行核验服务内容。</p>
            </footer>
          </div>
        </main>
      </div>

      <button
        aria-label="返回顶部"
        className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        tabIndex={showBackToTop ? 0 : -1}
        type="button"
      >
        <Icon name="arrow-up" size={20} />
      </button>
    </div>
  );
}
