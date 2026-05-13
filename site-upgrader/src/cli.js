#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { runUpgrade } from "./runUpgrade.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const program = new Command();

program
  .name("site-upgrader")
  .description("Download a website, improve it automatically, and export a static version")
  .requiredOption("-u, --url <url>", "Website URL to process")
  .option("-o, --out <dir>", "Output directory", "output")
  .option("-p, --project <name>", "Project name for report metadata", "improved-site")
  .option("-d, --depth <number>", "Crawl depth", "1")
  .option("-m, --mode <mode>", "Visual mode: balanced or aggressive", "balanced")
  .action(async (options) => {
    try {
      const mode = options.mode === "aggressive" ? "aggressive" : "balanced";

      console.log(`Downloading: ${options.url}`);
      console.log("Applying improvements...");
      const result = await runUpgrade({
        url: options.url,
        outDir: options.out,
        project: options.project,
        depth: options.depth,
        mode,
        cwd: projectRoot
      });

      console.log("Done.");
      console.log(`Original: ${result.originalDir}`);
      console.log(`Improved: ${result.improvedDir}`);
      console.log(`Report: ${result.reportFile}`);
    } catch (error) {
      console.error("Failed:", error.message);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
