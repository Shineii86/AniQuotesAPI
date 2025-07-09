import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const statusRes = await fetch("https://aniquotesapi.vercel.app/status");
    const statusData = await statusRes.json();

    const total = statusData.stats?.totalQuotes ?? "???";
    const status = statusData.status === "alive" ? "Alive" : "Down";

    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: `${status} | ${total} Quotes`,
      color: status === "Alive" ? "green" : "red"
    });
  } catch (error) {
    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: "Error fetching data",
      color: "lightgrey"
    });
  }
}
