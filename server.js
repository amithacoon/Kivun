
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'stats.json');

app.use(express.json());
// Serve static files from the build folder (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// --- Database Helper Functions (JSON File with In-Memory Fallback) ---

let inMemoryStats = null; // Fallback if FS is read-only

const getInitialStats = () => ({
    totalCharsAllTime: 0,
    totalCharsMonth: 0,
    totalCharsWeek: 0,
    totalReplacements: 0,
    usageCount: 0,
    lastUpdated: new Date().toISOString(),
    weekId: getWeekId(),
    monthId: getMonthId()
});

const getWeekId = () => {
    const d = new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
};

const getMonthId = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
};

// --- Mutex for preventing Race Conditions ---
let dbLock = Promise.resolve();

const withLock = async (fn) => {
    const currentLock = dbLock;
    let resolveLock;
    dbLock = new Promise(resolve => { resolveLock = resolve; });
    await currentLock;
    try {
        return await fn();
    } finally {
        resolveLock();
    }
};

const readDb = async () => {
    // 1. Try In-Memory first (most up to date if FS failed previously)
    if (inMemoryStats) return inMemoryStats;

    // 2. Try Disk
    try {
        if (fs.existsSync(DB_FILE)) {
            const fileContent = await fs.promises.readFile(DB_FILE, 'utf8');
            const data = JSON.parse(fileContent);
            const stats = { ...getInitialStats(), ...data };
            inMemoryStats = stats; // Sync memory
            return stats;
        }
    } catch (e) {
        console.error("Warning: Could not read DB file (might be first run or read-only)", e.message);
    }

    // 3. Fallback to fresh stats
    const fresh = getInitialStats();
    inMemoryStats = fresh;
    return fresh;
};

const writeDb = async (data) => {
    // Always update memory
    inMemoryStats = data;

    // Try update disk
    try {
        await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        // This is expected in Read-Only environments (like Azure Zip Deploy)
        // We suppress the crash, but data will be lost on server restart.
        console.warn("Notice: Could not write to disk (Environment might be read-only). Using in-memory storage.");
    }
};

// --- API Routes ---

// GET Stats
app.get('/api/stats', async (req, res) => {
    const data = await readDb();
    res.json(data);
});

// UPDATE Stats
app.post('/api/stats', async (req, res) => {
    const { chars, replacements } = req.body;
    
    const data = await withLock(async () => {
        const dbData = await readDb();
        const currentWeek = getWeekId();
        const currentMonth = getMonthId();

        // Reset counters if period changed
        if (dbData.weekId !== currentWeek) {
            dbData.totalCharsWeek = 0;
            dbData.weekId = currentWeek;
        }
        if (dbData.monthId !== currentMonth) {
            dbData.totalCharsMonth = 0;
            dbData.monthId = currentMonth;
        }

        // Update values
        const c = parseInt(chars) || 0;
        const r = parseInt(replacements) || 0;

        dbData.totalCharsAllTime += c;
        dbData.totalCharsMonth += c;
        dbData.totalCharsWeek += c;
        dbData.totalReplacements += r;
        dbData.usageCount += 1;
        dbData.lastUpdated = new Date().toISOString();

        await writeDb(dbData);
        return dbData;
    });

    res.json({ success: true, data });
});

// RESET Stats
app.post('/api/stats/reset', async (req, res) => {
    const { password } = req.body;
    
    // Simple authentication
    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) { 
        const freshStats = await withLock(async () => {
            const fresh = getInitialStats();
            await writeDb(fresh);
            return fresh;
        });
        return res.json({ success: true, data: freshStats });
    }
    
    res.status(403).json({ error: 'Invalid password' });
});

// --- Serve React App (Catch-All) ---
// Any request that doesn't match an API route is sent to index.html
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('App build not found. Did you run "npm run build"?');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/stats`);
});
