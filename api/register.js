
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      success: false,
      message: "Database configuration is missing."
    });
  }

  try {
    const { name, email } = req.body || {};

    if (typeof name !== "string" || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name and email are required."
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters."
      });
    }

    if (
      cleanEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`
      INSERT INTO hotspot_users (full_name, email)
      VALUES (${cleanName}, ${cleanEmail})
      RETURNING id, full_name, created_at
    `;

    return res.status(201).json({
      success: true,
      message: "Registration saved successfully!",
      user: rows[0]
    });
  } catch (error) {
    console.error("Registration failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save registration. Please try again."
    });
  }
}
