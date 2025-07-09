const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  try {
    const response = await fetch("https://aniquotesapi.vercel.app/status");
    const data = await response.json();

    const total = data?.stats?.totalQuotes || "???";
    const status = data?.status === "alive" ? "Alive" : "Down";

    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: `${status} | ${total} Quotes`,
      color: status === "Alive" ? "green" : "red"
    });
  } catch (err) {
    res.status(200).json({
      schemaVersion: 1,
      label: "AniQuotes",
      message: "Error",
      color: "lightgrey"
    });
  }
};
