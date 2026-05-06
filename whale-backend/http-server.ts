import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { getClusters } from "./lib/cluster";

const app = express();
const PORT = 3001;

app.use(cors());

// 📜 historical whale data
app.get("/whales", async (_req, res) => {
  const whales = await prisma.whaleTransaction.findMany({
    orderBy: { blockNumber: "desc" },
    take: 50,
  });

  res.json({ whales });
});

// 🧠 wallet clusters
app.get("/clusters", (_req, res) => {
  res.json({ clusters: getClusters() });
});

app.listen(PORT, () => {
  console.log(`🌐 HTTP API running on http://localhost:${PORT}`);
});