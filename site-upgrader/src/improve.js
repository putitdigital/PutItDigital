import fs from "fs-extra";
import path from "node:path";
import { globby } from "globby";
import * as cheerio from "cheerio";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";

const DEFAULT_ALT = "Website image";
const ENHANCEMENT_FONT_HREF = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&family=Manrope:wght@400;500;700&display=swap";

const resolveMode = (mode) => {
  if (mode === "aggressive") {
    return "aggressive";
  }

  return "balanced";
};

async function ensureEnhancementCss(rootDir, mode) {
  const target = path.join(rootDir, "__enhancements.css");
  const fileName = mode === "aggressive" ? "enhancements.aggressive.css" : "enhancements.css";
  const source = path.resolve(path.dirname(new URL(import.meta.url).pathname), fileName);
  const decodedSource = decodeURIComponent(source);
  await fs.copy(decodedSource, target);
  return target;
}

function improveHtmlContent(html, report) {
  const $ = cheerio.load(html, { decodeEntities: false });

  const body = $("body");
  if (body.length && !body.hasClass("su-upgraded")) {
    body.addClass("su-upgraded");
    report.visualUpgradeBodyClassAdded += 1;
  }

  if ($("html").length && !$("html").attr("lang")) {
    $("html").attr("lang", "en");
    report.langAdded += 1;
  }

  if ($("meta[charset]").length === 0) {
    $("head").prepend('<meta charset="utf-8">');
    report.charsetAdded += 1;
  }

  if ($('meta[name="viewport"]').length === 0) {
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1">');
    report.viewportAdded += 1;
  }

  if ($('link[href="__enhancements.css"]').length === 0) {
    $("head").append('<link rel="stylesheet" href="__enhancements.css">');
    report.enhancementCssLinked += 1;
  }

  if ($('link[rel="preconnect"][href="https://fonts.googleapis.com"]').length === 0) {
    $("head").append('<link rel="preconnect" href="https://fonts.googleapis.com">');
    report.fontPreconnectAdded += 1;
  }

  if ($('link[rel="preconnect"][href="https://fonts.gstatic.com"]').length === 0) {
    $("head").append('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    report.fontPreconnectAdded += 1;
  }

  if ($(`link[href="${ENHANCEMENT_FONT_HREF}"]`).length === 0) {
    $("head").append(`<link rel="stylesheet" href="${ENHANCEMENT_FONT_HREF}">`);
    report.fontStylesheetAdded += 1;
  }

  $("main, section, article, aside").each((_, el) => {
    const node = $(el);
    if (!node.hasClass("su-block")) {
      node.addClass("su-block");
      report.visualBlocksTagged += 1;
    }
  });

  $("button, input[type='submit'], input[type='button'], a[role='button']").each((_, el) => {
    const node = $(el);
    if (!node.hasClass("su-cta")) {
      node.addClass("su-cta");
      report.visualCtasTagged += 1;
    }
  });

  $("img").each((_, img) => {
    const node = $(img);

    if (!node.hasClass("su-media")) {
      node.addClass("su-media");
      report.visualMediaTagged += 1;
    }

    if (!node.attr("alt")) {
      node.attr("alt", DEFAULT_ALT);
      report.altAdded += 1;
    }

    if (!node.attr("loading")) {
      node.attr("loading", "lazy");
      report.lazyLoadingAdded += 1;
    }

    if (!node.attr("decoding")) {
      node.attr("decoding", "async");
      report.asyncDecodingAdded += 1;
    }
  });

  $("script[src]").each((_, script) => {
    const node = $(script);
    const src = node.attr("src") || "";

    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
      return;
    }

    if (!node.attr("defer") && !node.attr("async") && node.attr("type") !== "module") {
      node.attr("defer", "defer");
      report.deferAdded += 1;
    }
  });

  return $.html();
}

async function minifyCssFiles(rootDir, report) {
  const cssFiles = await globby(["**/*.css", "!**/__enhancements.css"], {
    cwd: rootDir,
    absolute: true
  });

  for (const cssFile of cssFiles) {
    const css = await fs.readFile(cssFile, "utf8");
    const minified = new CleanCSS({ level: 2 }).minify(css);

    if (!minified.styles) {
      continue;
    }

    await fs.writeFile(cssFile, minified.styles, "utf8");
    report.cssMinified += 1;
  }
}

async function improveHtmlFiles(rootDir, report) {
  const htmlFiles = await globby(["**/*.html", "**/*.htm"], {
    cwd: rootDir,
    absolute: true
  });

  for (const htmlFile of htmlFiles) {
    const original = await fs.readFile(htmlFile, "utf8");
    const improved = improveHtmlContent(original, report);

    const minified = await minifyHtml(improved, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: false,
      removeEmptyAttributes: false,
      minifyCSS: true,
      minifyJS: false
    });

    await fs.writeFile(htmlFile, minified, "utf8");
    report.htmlImproved += 1;
  }
}

export async function improveSite({ inputDir, outputDir, mode = "balanced" }) {
  await fs.remove(outputDir);
  await fs.copy(inputDir, outputDir);
  const visualMode = resolveMode(mode);
  await ensureEnhancementCss(outputDir, visualMode);

  const report = {
    htmlImproved: 0,
    cssMinified: 0,
    langAdded: 0,
    charsetAdded: 0,
    viewportAdded: 0,
    enhancementCssLinked: 0,
    altAdded: 0,
    lazyLoadingAdded: 0,
    asyncDecodingAdded: 0,
    deferAdded: 0,
    visualMode,
    visualUpgradeBodyClassAdded: 0,
    visualBlocksTagged: 0,
    visualCtasTagged: 0,
    visualMediaTagged: 0,
    fontPreconnectAdded: 0,
    fontStylesheetAdded: 0
  };

  await improveHtmlFiles(outputDir, report);
  await minifyCssFiles(outputDir, report);

  return report;
}
