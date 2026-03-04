"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const trimmed = address.trim();
    if (!trimmed) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmed }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      // Store result in sessionStorage, navigate to dashboard
      sessionStorage.setItem("intelligence", JSON.stringify(data.data));
      router.push("/dashboard");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* Background Grid */}
      <div className="bg-grid" style={{
        position: "fixed", inset: 0, zIndex: 0,
        opacity: 0.4,
      }} />

      {/* Background Orbs */}
      <div style={{
        position: "fixed", top: "-20%", left: "60%",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", left: "-10%",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "8px",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px"
          }}>◈</div>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            SolIntel
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="badge badge-violet">Beta</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Powered by Alchemy + GPT-4o-mini</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", zIndex: 10,
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 24px",
      }}>
        <div style={{ maxWidth: "640px", width: "100%", textAlign: "center" }}>

          {/* Tag */}
          <div className="animate-fade-in-up" style={{ marginBottom: "24px" }}>
            <span className="badge badge-cyan" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
              ◈ SOLANA INTELLIGENCE LAYER
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-1"
            style={{ fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.02em" }}
          >
            <span style={{ color: "var(--text-primary)" }}>On-chain data, </span>
            <span className="gradient-text">understood.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-2"
            style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "48px", maxWidth: "480px", margin: "0 auto 48px" }}
          >
            Paste any Solana wallet address. Get behavioral classification,
            risk scoring, and AI-generated intelligence — in seconds.
          </p>

          {/* Input Card */}
          <div
            className="card card-glow animate-fade-in-up delay-3"
            style={{ padding: "24px", textAlign: "left", marginBottom: "16px" }}
          >
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              Wallet Address
            </label>
            <input
              id="wallet-input"
              type="text"
              className="wallet-input"
              placeholder="Enter Solana wallet address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              spellCheck={false}
              autoComplete="off"
            />

            {error && (
              <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--red)" }}>
                ⚠ {error}
              </p>
            )}

            <button
              id="analyze-btn"
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !address.trim()}
              style={{ width: "100%", marginTop: "14px" }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                  Analyzing wallet...
                </>
              ) : (
                <>
                  ◈ Analyze Wallet
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="animate-fade-in-up delay-4" style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Analysis is based on on-chain behavioral patterns. Not financial advice.
          </p>

          {/* Feature Pills */}
          <div className="animate-fade-in-up delay-5" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px", flexWrap: "wrap" }}>
            {["Behavioral Profiling", "Risk Scoring", "Protocol Mapping", "AI Explanation"].map((f) => (
              <span key={f} style={{
                fontSize: "12px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
