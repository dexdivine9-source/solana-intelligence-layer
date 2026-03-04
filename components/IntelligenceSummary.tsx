"use client";

import { RiskLabel } from "@/types";

interface Props {
    summary: string;
    bulletInsights: string[];
    riskLabel: RiskLabel;
    profileBadge: string;
    address: string;
    generatedAt: string;
}

const riskConfig: Record<RiskLabel, { color: string; bg: string; border: string; label: string }> = {
    Low: {
        color: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
        border: "rgba(34,197,94,0.2)",
        label: "Low Risk"
    },
    Moderate: {
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.2)",
        label: "Moderate Risk"
    },
    High: {
        color: "#f97316",
        bg: "rgba(249,115,22,0.08)",
        border: "rgba(249,115,22,0.2)",
        label: "High Risk"
    },
    Critical: {
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.2)",
        label: "Critical Risk"
    },
};

export default function IntelligenceSummary({
    summary,
    bulletInsights,
    riskLabel,
    profileBadge,
    address,
    generatedAt,
}: Props) {
    const risk = riskConfig[riskLabel];
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const time = new Date(generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div
            className="card card-glow animate-fade-in-up"
            style={{
                padding: "28px 32px",
                background: "linear-gradient(135deg, #0f0e1f 0%, #12101e 100%)",
                borderColor: "rgba(139,92,246,0.3)",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* AI Icon */}
                    <div style={{
                        width: 40, height: 40,
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0
                    }}>
                        🧠
                    </div>
                    <div>
                        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                            Intelligence Summary
                        </h2>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                            {shortAddress} · {time}
                        </p>
                    </div>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="badge badge-violet">{profileBadge}</span>
                    <span
                        className="badge"
                        style={{
                            background: risk.bg,
                            border: `1px solid ${risk.border}`,
                            color: risk.color,
                        }}
                    >
                        ⊘ {risk.label}
                    </span>
                </div>
            </div>

            <div className="divider" style={{ marginBottom: "20px" }} />

            {/* AI Summary Paragraph */}
            <p style={{
                fontSize: "15px",
                lineHeight: "1.75",
                color: "var(--text-secondary)",
                marginBottom: "24px",
            }}>
                {summary}
            </p>

            {/* Bullet Insights */}
            {bulletInsights.length > 0 && (
                <div style={{
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                        Key Insights
                    </p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none" }}>
                        {bulletInsights.map((insight, i) => (
                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                                <span style={{ color: "var(--violet-400)", marginTop: "1px", flexShrink: 0 }}>▸</span>
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
