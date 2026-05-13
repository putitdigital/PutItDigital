import path from "node:path";
import fs from "fs-extra";
import { scrapeSite } from "./scrape.js";
import { improveSite } from "./improve.js";

const resolveMode = (mode) => (mode === "aggressive" ? "aggressive" : "balanced");

export async function runUpgrade({ url, outDir = "output", project = "improved-site", depth = 1, mode = "balanced", cwd = process.cwd() }) {
  const parsedDepth = Number(depth);
  if (Number.isNaN(parsedDepth) || parsedDepth < 1 || parsedDepth > 5) {
    throw new Error("depth must be a number between 1 and 5");
  }

  const visualMode = resolveMode(mode);

  const outputBase = path.resolve(cwd, outDir);
  const originalDir = path.join(outputBase, "original");
  const improvedDir = path.join(outputBase, "improved");
  const reportFile = path.join(outputBase, "report.json");

  await fs.ensureDir(outputBase);
  await fs.remove(originalDir);
  await fs.remove(improvedDir);

  await scrapeSite({ url, outputDir: originalDir, depth: parsedDepth });
  const improvements = await improveSite({ inputDir: originalDir, outputDir: improvedDir, mode: visualMode });

  const report = {
    project,
    sourceUrl: url,
    generatedAt: new Date().toISOString(),
    output: {
      originalDir,
      improvedDir
    },
    improvements
  };

  await fs.writeJson(reportFile, report, { spaces: 2 });

  return {
    report,
    reportFile,
    outputBase,
    originalDir,
    improvedDir
  };
}
