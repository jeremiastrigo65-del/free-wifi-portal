
import "dotenv/config";
import express from "express";
import { neon } from "@neondatabase/serverless";

const app = express();
const PORT = process.env.PORT || 3001;

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Hotspot API is running." });
});

app.post("/api/register", async (req, res) => {
  try {
    let { name, email } = req.body || {};

    if (typeof name !== "string" || typeof email !== "string") {
      return res.status(400).json({
        message: "Please enter your name and email."
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        message: "Name must be between 2 and 100 characters."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 255 || !emailPattern.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    const rows = await sql`
      INSERT INTO hotspot_users (full_name, email)
      VALUES (${name}, ${email})
      RETURNING id, full_name, created_at
    `;

    return res.status(201).json({
      success: true,
      message: "Registration saved successfully!",
      user: rows[0]
    });
  } catch (error) {
    console.error("Registration failed:", error.message);

    return res.status(500).json({
      message: "Unable to save registration. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Hotspot API running on port ${PORT}`);
});
