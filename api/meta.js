export default function handler(req, res) {
  res.status(200).json({
    creator: "Shinei Nouzen",
    github: "https://github.com/Shineii86",
    telegram: "https://telegram.me/Shineii86",
    timestamp: new Date().toISOString()
  });
}
