
export default function handler(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "Hotspot API is running on Vercel."
  });
}
