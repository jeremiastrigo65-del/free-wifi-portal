
import { useState } from "react";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);

    if (!consent) {
      setResult({
        type: "error",
        message: "Please agree to the demo registration terms.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      setResult({
        type: "success",
        message:
          "Registration successful! This demo does not activate real mobile data or unlock internet access.",
      });

      setName("");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setResult({
        type: "error",
        message:
          error.message ||
          "Unable to register right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function goToPortal() {
    document.getElementById("registration")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <main className="portal-page">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">⌁</span>
          <span>Campus<span className="brand-accent">Connect</span></span>
        </a>

        <div className="online-status">
          <span className="status-dot"></span>
          
        </div>
      </header>

      <section className="portal-layout">
        <div className="portal-card" id="registration">
          <div className="portal-card-top">
            <div className="wifi-icon">⌁</div>
            <span className="mini-status">
              <span className="status-dot"></span>
             connecting
            </span>
          </div>

          <p className="eyebrow">WELCOME TO FREE WIFI</p>

          <h1>
            Campus Free
            <span> Wi-Fi</span>
          </h1>

          <p className="portal-description">
            Register below to continue to the campus Wi-Fi portal.
          </p>

          <div className="offer-card">
            <div className="offer-copy">
              <span className="offer-label">SPECIAL OFFER</span>
              <h2>Claim your free 2GB!</h2>
              <p>
                Complete the registration form to try our campus portal.
              </p>
            </div>

            <div className="offer-amount">
              <strong>2GB</strong>
              <span>FREE*</span>
            </div>

            <div className="offer-decoration offer-decoration-one"></div>
            <div className="offer-decoration offer-decoration-two"></div>
          </div>

          <div className="form-heading">
            <h2>Register to get started</h2>
            <p>Enter your details below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              maxLength={100}
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              maxLength={254}
            />

            <label className="consent-row">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <span>
                I agree to the demo registration terms and understand that
                this portal does not provide actual mobile data.
              </span>
            </label>

            {result && (
              <div
                className={`result-message ${result.type}`}
                role="status"
              >
                {result.message}
              </div>
            )}

            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register for Free 2GB Wi-Fi"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="portal-footer">
            <span>🔒 registration</span>
            <span>Campus Connect</span>
          </div>
        </div>
      </section>

      <footer className="page-footer">
        <p>
          *The 2GB offer is for demonstration purposes only. Registration
          does not provide actual mobile data or guarantee internet access.
        </p>
      </footer>

      <button
        className="floating-claim"
        type="button"
        onClick={goToPortal}
        aria-label="Claim your free 2GB demo offer"
      >
        <span className="floating-emoji">🎁</span>

        <span className="floating-copy">
          <small>YOUR OFFER</small>
          <strong>Claim Your Free 2GB</strong>
        </span>

        <span className="floating-arrow">→</span>
      </button>
    </main>
  );
}
