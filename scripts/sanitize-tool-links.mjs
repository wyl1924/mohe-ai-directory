import { readFile, writeFile } from "node:fs/promises";

const dataPath = new URL("../data/site-data.json", import.meta.url);
const data = JSON.parse(await readFile(dataPath, "utf8"));

const directUrlByTitle = new Map([
  ["即梦ai-最强免费视频生成", "https://jimeng.jianying.com/"],
  ["即梦ai-最强免费图片生成", "https://jimeng.jianying.com/"],
  ["即梦ai-免费视频生成", "https://jimeng.jianying.com/"],
  ["即梦ai", "https://jimeng.jianying.com/"],
  ["小云雀-ai视频神器", "https://xyq.jianying.com/"],
  ["小云雀-ai视频智能体", "https://xyq.jianying.com/"],
  ["云幻ai-零基础自媒体赚钱", "https://apps.apple.com/cn/app/%E4%BA%91%E5%B9%BBai/id6761784574"],
  ["蚂蚁探子-股市情报站", "https://ant-scout.tcbot.cc/"],
  ["文字游侠-Al一键写头条", "https://wenan.tcbot.cc/"],
  ["毕业宝ai", "https://biye000.com/"],
  ["一字成文ai", "https://yizipaper.com/web/"],
  ["幂简AI提示词", "https://prompts.explinks.com/"],
  ["mewxai", "https://www.mewx.art/"],
  ["韵动ai-数字人/声音克隆", "https://apps.apple.com/cn/app/%E9%9F%B5%E5%8A%A8ai/id6743003402"],
  ["歌者ppt", "https://gezhe.com/"],
  ["揽睿星舟", "https://lanrui.co/"],
  ["transmonkey", "https://www.transmonkey.ai/"],
  ["HelpLook", "https://www.helplook.com/"],
  ["Qoder", "https://qoder.com/"],
]);

const internalUrls = [
  ...new Set(
    data.cards
      .map((card) => card.url)
      .filter((value) => {
        try {
          const url = new URL(value);
          return (
            url.hostname === "feizhuke.com" &&
            url.pathname !== "/" &&
            !url.pathname.startsWith("/sites/") &&
            !url.pathname.startsWith("/wp-content/")
          );
        } catch {
          return false;
        }
      }),
  ),
];

const resolved = new Map();
let cursor = 0;
const workers = Array.from({ length: 16 }, async () => {
  while (cursor < internalUrls.length) {
    const index = cursor;
    cursor += 1;
    const source = internalUrls[index];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(source, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138 Safari/537.36",
        },
      });
      if (response.url && new URL(response.url).hostname !== "feizhuke.com") {
        resolved.set(source, response.url);
      }
      await response.body?.cancel();
    } catch {
      // Preserve the original URL when a source redirect is unavailable.
    } finally {
      clearTimeout(timeout);
    }
  }
});
await Promise.all(workers);

function cleanUrl(raw) {
  let value = resolved.get(raw) ?? raw;
  if (value === "sharegpt.com") value = "https://sharegpt.com";
  if (value.includes("magiceraserhttps://")) {
    value = "https://magicstudio.com/zh/magiceraser";
  }
  if (value.includes("feizhuke.comhttps://imgokok.com")) {
    value = value.slice(0, value.indexOf("?ref="));
  }

  try {
    let url = new URL(value);
    if (url.hostname === "r.brandreward.com") {
      const destination = url.searchParams.get("url");
      if (destination) return cleanUrl(destination);
    }
    if (url.hostname === "c.ga-net.com") {
      const destination = url.searchParams.get("d");
      if (destination) return cleanUrl(destination);
    }
    if (url.hostname === "hanabi.data-viz.cn") {
      url.searchParams.set("lang", "zh-CN");
    }
    if (url.hostname === "paperfake.cn" && url.searchParams.get("q") === "feizhuke") {
      url.searchParams.delete("q");
    }

    for (const key of [...url.searchParams.keys()]) {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedKey.startsWith("utm_") ||
        normalizedKey.startsWith("mtm_") ||
        /invit|referr|referral|affiliate|(^|_)aff($|_)/.test(normalizedKey) ||
        [
          "ref",
          "ref_id",
          "ref_aff",
          "via",
          "source",
          "sourceid",
          "source_id",
          "sourcecode",
          "from",
          "fromid",
          "_from",
          "open_from",
          "sfrom",
          "ch",
          "cgv",
          "cg_click_id",
          "campaign",
          "channel",
          "channelcode",
          "channelid",
          "_channel_track_key",
          "activityid",
          "ac",
          "ad",
          "atk",
          "atp",
          "biz",
          "code",
          "coupon",
          "extendid",
          "fpr",
          "fr",
          "fu",
          "geo_waituo_feizhuke",
          "gr_pk",
          "gr_uid",
          "gspk",
          "gsxid",
          "hmmd",
          "hmsr",
          "inv",
          "ivu",
          "keyfrom",
          "lmref",
          "pro_t",
          "ps_partner_key",
          "ps_xid",
          "pscd",
          "r",
          "registerode",
          "rel",
          "rid",
          "seller",
          "sid",
          "spid",
          "spread",
          "statid",
          "s_uid",
          "ug_apk_token",
          "usercode",
          "utm",
          "ytag",
        ].includes(normalizedKey)
      ) {
        url.searchParams.delete(key);
      }
    }
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

data.cards = data.cards.map((card) => {
  if (card.title === "飞猪ai导航") {
    return {
      ...card,
      title: "墨盒 AI 导航",
      description:
        "墨盒 AI 导航，收集写作、绘画、视频、音频、编程与办公等实用人工智能工具。",
      url: "/",
      detailUrl: "/",
      imagePath: "/brand/mohe-bear.png",
    };
  }
  const url = directUrlByTitle.get(card.title) ?? cleanUrl(card.url);
  const hidden = card.title === "AI工具便宜合租" || card.title === "真能造";
  let description = card.description;
  if (card.title === "歌者ppt") {
    description = "歌者 AI PPT，输入描述即可生成风格自然、易于编辑的演示文稿内容。";
  }
  return {
    ...card,
    description,
    url: hidden ? "/" : url,
    detailUrl: hidden ? "/" : url,
    visible: hidden ? false : card.visible,
  };
});
data.quick = (data.quick ?? [])
  .filter((item) => !/合租|免费GPT|Gemini3-免费替代/.test(item.title))
  .map((item) => ({
    ...item,
    url:
      item.title === "免费AI视频图片"
        ? "https://xyq.jianying.com/"
        : cleanUrl(item.url),
  }));
data.linkSanitization = {
  resolvedInternalLinks: resolved.size,
  trackingParametersRemoved: true,
};
delete data.source;
if (data.assetSummary) delete data.assetSummary.failures;

await writeFile(dataPath, JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    {
      internalLinksChecked: internalUrls.length,
      internalLinksResolved: resolved.size,
      cards: data.cards.length,
    },
    null,
    2,
  ),
);
