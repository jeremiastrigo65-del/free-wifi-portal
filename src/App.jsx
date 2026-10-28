
import { useState } from "react";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setResult(null);

    if (!consent) {
      setResult({
        type: "error",
        message: "Please agree to the demo data-use notice."
      });
      return;
    }

    setLoading(true);

    try {
     
const response = await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email })
});

const text = await response.text();

let data;

try {
  data = text ? JSON.parse(text) : {};
} catch {
  throw new Error(
    `Server returned invalid JSON (HTTP ${response.status}). Check your backend terminal.`
  );
}

if (!response.ok) {
  throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
}

if (!data.success) {
  throw new Error(data.message || "Registration was not confirmed.");
}

      setResult({
        type: "success",
        message:
          "Registration saved! Router authorization is still required to enable internet access."
      });

      setName("");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setResult({
        type: "error",
        message: error.message || "Cannot connect to the server."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal">
      <section className="portal-card">
        <div className="wifi-icon" aria-hidden="true">⌁</div>

        <p className="eyebrow">WELCOME TO</p>
        <h1>Campus Free Wi-Fi</h1>
        <p className="subtitle">
          Connect, learn, and browse. Complete the form to register
          for our classroom hotspot demonstration.
        </p>

        <div className="network-status">
          <span className="status-dot" />
          Hotspot registration portal
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={255}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I understand my name and email will be stored in the
              demonstration database for this project.
            </span>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register for Free Wi-Fi"}
          </button>
        </form>

        {result && (
          <div
            className={`message ${result.type}`}
            role="status"
            aria-live="polite"
          >
            {result.message}
          </div>
        )}

        <p className="privacy-note">
          Classroom demonstration only. Do not submit sensitive
          information. Registration alone does not unlock internet access.
        </p>

        <footer>BSIT Project · Wi-Fi Captive Portal</footer>
      </section>
    </main>
  );
}
