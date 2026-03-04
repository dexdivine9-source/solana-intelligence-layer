"use client";

import { ProtocolExposure } from "@/types";

interface Props {
    protocols: ProtocolExposure[];
}

const typeColors: Record<ProtocolExposure["type"], string> = {
    DEX: "var(--violet-400)",
    Lending: "var(--cyan-400)",
    Staking: "#22c55e",
    NFT: "#f59e0b",
    Bridge: "#f97316",
    Other: "var(--text-muted)",
};

export default function ProtocolBreakdown({ protocols }: Props) {
    const top = protocols.slice(0, 6);

    return (
        <div className="card" style={{ padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Protocol Exposure
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    On-chain protocol interaction breakdown
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {top.map((p, i) => (
                    <div key={i}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{
                                    width: 6, height: 6,
                                    borderRadius: "50%",
                                    background: typeColors[p.type],
                                    display: "inline-block",
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                    {p.protocol}
                                </span>
                                <span style={{
                                    fontSize: "10px",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    background: "rgba(255,255,255,0.05)",
                                    color: typeColors[p.type],
                                    fontWeight: 600,
                                }}>
                                    {p.type}
                                </span>
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                                {p.percentage}%
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="risk-track">
                            <div
                                className="risk-fill"
                                style={{
                                    width: `${Math.min(p.percentage, 100)}%`,
                                    background: `linear-gradient(90deg, ${typeColors[p.type]}99, ${typeColors[p.type]})`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {Object.entries(typeColors).map(([type, color]) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
