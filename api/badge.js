// File: /api/badge.js

export default async function handler(req, res) {
  try {
    const response = await fetch("https://aniquotesapi.vercel.app/status");

    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);

    const data = await response.json();
    const total = data?.stats?.totalQuotes || "???";
    const isAlive = data?.status === "alive";

    // Add metadata as HTTP headers (optional)
    res.setHeader("X-Creator", "Shinei Nouzen");
    res.setHeader("X-GitHub", "https://github.com/Shineii86");
    res.setHeader("X-Telegram", "https://telegram.me/Shineii86");
    res.setHeader("X-Timestamp", new Date().toISOString());

    // Shields.io compatible badge response
    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: `${isAlive ? "Alive" : "Down"} | ${total} Quotes`,
      color: isAlive ? "green" : "red"
    });
  } catch (error) {
    console.error("Badge handler error:", error);

    res.setHeader("X-Error", error.message);

    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: "Error",
      color: "lightgrey"
    });
  }
}
