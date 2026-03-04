"use client";

import { RiskLabel } from "@/types";

interface Props {
    riskScore: number;
    volatilityScore: number;
    diversificationScore: number;
    riskLabel: RiskLabel;
    contractInteractionRisk: string;
}

const riskColors: Record<number, string> = {};

function getColor(score: number): string {
    if (score >= 75) return "#ef4444";
    if (score >= 50) return "#f97316";
    if (score >= 25) return "#f59e0b";
    return "#22c55e";
}

function getRiskLabelColor(label: RiskLabel): string {
    switch (label) {
        case "Low": return "#22c55e";
        case "Moderate": return "#f59e0b";
        case "High": return "#f97316";
        case "Critical": return "#ef4444";
    }
}

interface ScoreRowProps {
    label: string;
    score: number;
    icon: string;
    description: string;
}

function ScoreRow({ label, score, icon, description }: ScoreRowProps) {
    const color = getColor(score);
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px" }}>{icon}</span>
                    <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{label}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{description}</p>
                    </div>
                </div>
                <span style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color,
                    fontFamily: "JetBrains Mono, monospace",
                    minWidth: "48px",
                    textAlign: "right"
                }}>
                    {score}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>/100</span>
                </span>
            </div>
            <div className="risk-track">
                <div
                    className="risk-fill"
                    style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
                />
            </div>
        </div>
    );
}

export default function RiskPanel({
    riskScore,
    volatilityScore,
    diversificationScore,
    riskLabel,
    contractInteractionRisk,
}: Props) {
    const labelColor = getRiskLabelColor(riskLabel);

    return (
        <div className="card" style={{ padding: "24px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                        Risk Intelligence
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Composite scoring model
                    </p>
                </div>

                {/* Overall Risk Badge */}
                <div style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: `${labelColor}15`,
                    border: `1px solid ${labelColor}30`,
                    textAlign: "center"
                }}>
                    <p style={{ fontSize: "20px", fontWeight: 800, color: labelColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                        {riskScore}
                    </p>
                    <p style={{ fontSize: "10px", color: labelColor, fontWeight: 600, letterSpacing: "0.06em", marginTop: "2px" }}>
                        {riskLabel.toUpperCase()}
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <ScoreRow
                    label="Risk Score"
                    score={riskScore}
                    icon="⊘"
                    description="Overall on-chain risk assessment"
                />
                <ScoreRow
                    label="Volatility Score"
                    score={volatilityScore}
                    icon="⚡"
                    description="Capital movement intensity"
                />
                <ScoreRow
                    label="Diversification"
                    score={diversificationScore}
                    icon="◎"
                    description="Portfolio spread across protocols"
                />
            </div>

            {/* Contract Risk */}
            <div style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px" }}>📄</span>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Contract Interaction Risk</p>
                </div>
                <span style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: contractInteractionRisk === "High" ? "#ef4444" : contractInteractionRisk === "Medium" ? "#f59e0b" : "#22c55e",
                }}>
                    {contractInteractionRisk}
                </span>
            </div>
        </div>
    );
}
