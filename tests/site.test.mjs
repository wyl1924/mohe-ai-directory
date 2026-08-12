import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const execFileAsync = promisify(execFile);

test("resolves GitHub Pages paths for custom and default domains", async () => {
  const configUrl = new URL("../next.config.ts", import.meta.url).href;
  const script = `
    import { resolvePagesBasePath } from ${JSON.stringify(configUrl)};
    process.stdout.write(JSON.stringify([
      resolvePagesBasePath("owner/project", "mohe1924.cn"),
      resolvePagesBasePath("owner/project"),
      resolvePagesBasePath("owner/owner.github.io"),
      resolvePagesBasePath(),
    ]));
  `;
  const { stdout } = await execFileAsync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "--eval",
    script,
  ]);

  assert.deepEqual(JSON.parse(stdout), ["", "/project", "", ""]);
});

test("exports the 墨盒 directory as a static site", async () => {
  await access(new URL("../out/index.html", import.meta.url));
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /墨盒/);
  assert.match(html, /AI热门工具/);
  assert.match(html, /输入工具名称、功能或关键词/);
  assert.match(html, /brand\/mohe-bear\.png/);
  assert.doesNotMatch(html, /\/api\/|管理入口|soweads|wwads|histats|51\.la/i);
});

test("exports static tool detail pages linked from the homepage", async () => {
  const source = await readFile(
    new URL("../data/site-data.json", import.meta.url),
    "utf8",
  );
  const data = JSON.parse(source);
  const card = data.cards.find((item) => item.visible !== false);
  assert.ok(card, "catalog should contain a visible card");

  const detailHtml = await readFile(
    new URL(`../out/tools/${card.id}/index.html`, import.meta.url),
    "utf8",
  );
  const homepageHtml = await readFile(
    new URL("../out/index.html", import.meta.url),
    "utf8",
  );

  assert.ok(detailHtml.includes(card.title));
  assert.ok(detailHtml.includes(card.description));
  assert.match(detailHtml, /工具介绍/);
  assert.match(detailHtml, /访问官网/);
  assert.ok(homepageHtml.includes(`tools/${card.id}/`));
  assert.doesNotMatch(detailHtml, /\/api\//i);
});

test("keeps the full JSON catalog local and ad-free", async () => {
  const source = await readFile(
    new URL("../data/site-data.json", import.meta.url),
    "utf8",
  );
  const data = JSON.parse(source);

  assert.equal(data.categories.length, 33);
  assert.equal(data.cards.length, 1857);
  const visibleIds = new Set();
  for (const card of data.cards) {
    assert.match(card.imagePath, /^\/(?:assets\/tools|brand)\//);
    await access(new URL(`../public${card.imagePath}`, import.meta.url));
    assert.match(card.url, /^(?:https?:\/\/|\/)/i);
    if (card.visible !== false) {
      assert.ok(Number.isSafeInteger(card.id) && card.id > 0);
      assert.match(String(card.id), /^[1-9]\d*$/);
      assert.ok(!visibleIds.has(card.id), `duplicate visible card id: ${card.id}`);
      visibleIds.add(card.id);
    }
  }

  assert.doesNotMatch(source, /soweads|wwads|histats|sdk\.51\.la|AI神器推荐/i);
  await access(new URL("../public/brand/mohe-bear.png", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
});

test("contains no server-only application surfaces", async () => {
  for (const path of [
    "app/api/directory/route.ts",
    "app/admin/page.tsx",
    "db/catalog.ts",
    "worker/index.ts",
    ".openai/hosting.json",
  ]) {
    await assert.rejects(access(new URL(`../${path}`, import.meta.url)));
  }

  const packageSource = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(packageSource, /cloudflare|wrangler|vinext|drizzle/i);
  const workflowSource = await readFile(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  );
  assert.match(
    workflowSource,
    /GITHUB_PAGES_CUSTOM_DOMAIN:\s*mohe1924\.cn/,
  );
  await access(new URL("../out/.nojekyll", import.meta.url));
  await access(projectRoot);
});
