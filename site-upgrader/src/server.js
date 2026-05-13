import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import express from "express";
import fs from "fs-extra";
import { runUpgrade } from "./runUpgrade.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDir));
app.use("/exports", express.static(path.join(rootDir, "output")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "site-upgrader-web" });
});

app.post("/api/upgrade", async (req, res) => {
  try {
    const { url, project = "improved-site", out = "output", depth = 1, mode = "balanced" } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "A valid 'url' value is required." });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: "URL is invalid." });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: "Only http and https URLs are supported." });
    }

    const visualMode = mode === "aggressive" ? "aggressive" : "balanced";

    const result = await runUpgrade({
      url,
      outDir: out,
      project,
      depth,
      mode: visualMode,
      cwd: rootDir
    });

    const reportRel = path.relative(rootDir, result.reportFile);
    const originalRel = path.relative(rootDir, result.originalDir);
    const improvedRel = path.relative(rootDir, result.improvedDir);

    return res.json({
      message: "Upgrade completed",
      report: result.report,
      files: {
        reportPath: reportRel,
        originalPath: originalRel,
        improvedPath: improvedRel,
        improvedPreview: "/exports/improved/index.html"
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error" });
  }
});

app.get("*", async (_req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  const exists = await fs.pathExists(indexPath);
  if (!exists) {
    return res.status(404).send("UI not found");
  }
  return res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Site Upgrader Web running on http://localhost:${port}`);
});
