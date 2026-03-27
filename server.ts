import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(STATS_FILE))) {
  fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
}

// Default stats
const defaultStats = {
  totalCharsAllTime: 0,
  totalCharsMonth: 0,
  totalCharsWeek: 0,
  totalReplacements: 0,
  usageCount: 0,
  lastUpdated: new Date().toISOString(),
  weekId: "",
  monthId: "",
};

// Helper to get current week/month IDs
const getPeriodIds = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Get ISO week number
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  
  return {
    weekId: `${year}-W${weekNo}`,
    monthId: `${year}-${month + 1}`
  };
};

// Load stats from file
const loadStats = () => {
  let stats = { ...defaultStats };
  if (fs.existsSync(STATS_FILE)) {
    try {
      const data = fs.readFileSync(STATS_FILE, "utf8");
      stats = { ...stats, ...JSON.parse(data) };
    } catch (e) {
      console.error("Error reading stats file", e);
    }
  }

  const { weekId, monthId } = getPeriodIds();
  let needsSave = false;

  if (stats.weekId !== weekId) {
    stats.weekId = weekId;
    stats.totalCharsWeek = 0;
    needsSave = true;
  }
  
  if (stats.monthId !== monthId) {
    stats.monthId = monthId;
    stats.totalCharsMonth = 0;
    needsSave = true;
  }

  if (needsSave) {
    saveStats(stats);
  }

  return stats;
};

// Save stats to file
const saveStats = (stats: any) => {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing stats file", e);
  }
};

// API routes
app.get("/api/stats", (_req, res) => {
  const stats = loadStats();
  res.json(stats);
});

app.post("/api/stats", (req, res) => {
  const { chars, replacements } = req.body;
  if (typeof chars !== "number" || typeof replacements !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const stats = loadStats();
  stats.totalCharsAllTime += chars;
  stats.totalCharsMonth += chars;
  stats.totalCharsWeek += chars;
  stats.totalReplacements += replacements;
  stats.usageCount += 1;
  stats.lastUpdated = new Date().toISOString();

  saveStats(stats);
  res.json({ success: true, stats });
});

app.post("/api/stats/reset", (req, res) => {
  const { password } = req.body;
  // Use environment variable or a default numbers-only password
  const validPassword = process.env.ADMIN_PASSWORD || "123456";
  
  if (password === validPassword) {
    saveStats({ ...defaultStats });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
