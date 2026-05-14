const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "kids.json");

app.use(express.json());
app.use(express.static(__dirname));

function clampNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

function normalizeKidRecord(kid) {
  const safeKid = kid && typeof kid === "object" ? kid : {};
  return {
    id: String(safeKid.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    name: normalizeName(safeKid.name),
    grade: String(safeKid.grade || "").trim(),
    icon: String(safeKid.icon || "").trim(),
    color: String(safeKid.color || "").trim(),
    score: Math.max(0, clampNumber(safeKid.score, 0)),
    bestScore: Math.max(0, clampNumber(safeKid.bestScore, 0)),
    level: Math.max(1, Math.floor(clampNumber(safeKid.level, 1))),
    questionsThisLevel: Math.max(0, Math.floor(clampNumber(safeKid.questionsThisLevel, 0))),
    neededForNextLevel: Math.max(1, Math.floor(clampNumber(safeKid.neededForNextLevel, 10))),
    createdAt: safeKid.createdAt || new Date().toISOString(),
    updatedAt: safeKid.updatedAt || null
  };
}

async function readKids() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const kids = Array.isArray(parsed) ? parsed : [];
    const normalized = kids.map((kid) => normalizeKidRecord(kid));

    // Backfill old records (created before score persistence existed).
    if (JSON.stringify(kids) !== JSON.stringify(normalized)) {
      await writeKids(normalized);
    }

    return normalized;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeKids(kids) {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(kids, null, 2)}\n`, "utf8");
}

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

app.get("/api/kids", async (_req, res) => {
  try {
    const kids = await readKids();
    res.json({ kids });
  } catch (error) {
    res.status(500).json({ error: "Failed to load kids." });
  }
});

app.post("/api/kids", async (req, res) => {
  try {
    const name = normalizeName(req.body && req.body.name);
    const grade = String((req.body && req.body.grade) || "").trim();
    const icon = String((req.body && req.body.icon) || "").trim();
    const color = String((req.body && req.body.color) || "").trim();

    if (!name) {
      res.status(400).json({ error: "Name is required." });
      return;
    }

    if (!grade) {
      res.status(400).json({ error: "Grade is required." });
      return;
    }

    const kids = await readKids();
    const exists = kids.some((kid) => String(kid.name).toLowerCase() === name.toLowerCase());
    if (exists) {
      res.status(409).json({ error: "This kid has already been added." });
      return;
    }

    const kid = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      grade,
      icon,
      color,
      score: 0,
      bestScore: 0,
      level: 1,
      questionsThisLevel: 0,
      neededForNextLevel: 10,
      createdAt: new Date().toISOString()
    };

    kids.push(kid);
    await writeKids(kids);
    res.status(201).json({ kid });
  } catch (error) {
    res.status(500).json({ error: "Failed to save kid." });
  }
});

app.patch("/api/kids/:id/progress", async (req, res) => {
  try {
    const kidId = String(req.params.id || "").trim();
    if (!kidId) {
      res.status(400).json({ error: "Kid id is required." });
      return;
    }

    const kids = await readKids();
    const index = kids.findIndex((kid) => String(kid.id) === kidId);
    if (index < 0) {
      res.status(404).json({ error: "Kid not found." });
      return;
    }

    const current = kids[index];
    const next = {
      ...current,
      score: Math.max(0, clampNumber(req.body && req.body.score, current.score || 0)),
      bestScore: Math.max(0, clampNumber(req.body && req.body.bestScore, current.bestScore || 0)),
      level: Math.max(1, Math.floor(clampNumber(req.body && req.body.level, current.level || 1))),
      questionsThisLevel: Math.max(0, Math.floor(clampNumber(req.body && req.body.questionsThisLevel, current.questionsThisLevel || 0))),
      neededForNextLevel: Math.max(1, Math.floor(clampNumber(req.body && req.body.neededForNextLevel, current.neededForNextLevel || 10))),
      updatedAt: new Date().toISOString()
    };

    kids[index] = next;
    await writeKids(kids);
    res.json({ kid: next });
  } catch (error) {
    res.status(500).json({ error: "Failed to update kid progress." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`EduKids server running at http://localhost:${PORT}`);
});
