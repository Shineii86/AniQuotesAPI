export default async function handler(req, res) {
  try {
    const response = await fetch("https://aniquotesapi.vercel.app/status");

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
    }

    const data = await response.json();
    const total = data?.stats?.totalQuotes || "???";
    const isAlive = data?.status === "alive";

    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: `${isAlive ? "Alive" : "Down"} | ${total} Quotes`,
      color: isAlive ? "green" : "red",
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Badge handler error:", error);

    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: "Error",
      color: "lightgrey",
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        timestamp: new Date().toISOString()
      }
    });
  }
}
