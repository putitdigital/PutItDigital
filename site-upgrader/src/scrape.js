import scrape from "website-scraper";

const sameHost = (seedUrl) => {
  const base = new URL(seedUrl);
  return (nextUrl) => {
    try {
      const parsed = new URL(nextUrl);
      return parsed.hostname === base.hostname;
    } catch {
      return false;
    }
  };
};

export async function scrapeSite({ url, outputDir, depth = 1 }) {
  await scrape({
    urls: [url],
    directory: outputDir,
    recursive: true,
    maxDepth: depth,
    prettyUrls: false,
    urlFilter: sameHost(url)
  });
}
