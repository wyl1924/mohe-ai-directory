# 墨盒

墨盒是一个纯前端 AI 工具导航。页面、搜索、分类筛选和全部工具内容都在浏览器中运行，数据来自本地 JSON；项目不使用数据库、对象存储、后台接口或 Cloudflare 服务。

每个可见工具都会在构建时生成独立的 `/tools/<id>/` 详情页。首页卡片进入站内详情，详情页再提供官网直达和同类工具推荐。

## 本地运行

需要 Node.js 22 或更高版本：

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 内容维护

工具和分类的唯一数据源是：

```text
data/site-data.json
```

- `categories`：分类和子分类
- `cards`：工具标题、简介、地址、图标、排序和显示状态
- 工具图标位于 `public/assets/tools/`
- 品牌资源位于 `public/brand/`

编辑 JSON 或替换图片后提交到 GitHub，GitHub Actions 会自动重新构建并发布网站。纯静态站没有在线管理后台，因此内容修改需要经过一次自动发布。

## 构建

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` 会在 `out/` 生成可直接托管的 HTML、CSS、JavaScript、JSON 数据和图片。

## GitHub Pages

项目包含 `.github/workflows/pages.yml`：

1. 推送到 `main` 分支。
2. GitHub Actions 自动安装依赖并运行静态构建。
3. `out/` 会自动发布到 GitHub Pages。

生产工作流为自定义域名 `mohe1924.cn` 使用根路径；未设置自定义域名时，仍会自动识别仓库名并配置 GitHub Pages 子路径，本地构建也保持根路径。首次部署前，请在仓库 **Settings → Pages** 中确认发布来源为 **GitHub Actions**，填写自定义域名 `mohe1924.cn`，并按 GitHub 提示完成 DNS 配置。
