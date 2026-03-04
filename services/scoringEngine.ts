import { WalletMetrics, RiskLabel } from "@/types";

// ─────────────────────────────────────────────
// Risk Label Classifier
// ─────────────────────────────────────────────

export function classifyRiskLabel(riskScore: number): RiskLabel {
    if (riskScore >= 75) return "Critical";
    if (riskScore >= 50) return "High";
    if (riskScore >= 25) return "Moderate";
    return "Low";
}

// ─────────────────────────────────────────────
// Score Summary (used for display + AI context)
// ─────────────────────────────────────────────

export interface ScoreSummary {
    riskScore: number;
    riskLabel: RiskLabel;
    volatilityScore: number;
    diversificationScore: number;
    whaleLevel: string;
    transactionFrequency: string;
    activityType: string;
    contractInteractionRisk: string;
    protocolBreakdown: string;
}

export function buildScoreSummary(metrics: WalletMetrics): ScoreSummary {
    const riskLabel = classifyRiskLabel(metrics.riskScore);

    const protocolBreakdown = metrics.protocolExposure
        .slice(0, 5)
        .map((p) => `${p.protocol} (${p.percentage}%)`)
        .join(", ");

    return {
        riskScore: metrics.riskScore,
        riskLabel,
        volatilityScore: metrics.volatilityScore,
        diversificationScore: metrics.diversificationScore,
        whaleLevel: metrics.whaleLevel,
        transactionFrequency: metrics.transactionFrequency,
        activityType: metrics.activityType,
        contractInteractionRisk: metrics.contractInteractionRisk,
        protocolBreakdown,
    };
}

// ─────────────────────────────────────────────
// Score Color Helpers (for UI)
// ─────────────────────────────────────────────

export function getRiskColor(riskLabel: RiskLabel): string {
    switch (riskLabel) {
        case "Low": return "#22c55e";      // green
        case "Moderate": return "#f59e0b"; // amber
        case "High": return "#f97316";     // orange
        case "Critical": return "#ef4444"; // red
    }
}

export function getScoreColor(score: number): string {
    if (score >= 75) return "#ef4444";
    if (score >= 50) return "#f97316";
    if (score >= 25) return "#f59e0b";
    return "#22c55e";
}

export function getWhaleBadgeColor(level: string): string {
    switch (level) {
        case "Mega Whale": return "#a855f7"; // violet
        case "Whale": return "#6366f1";      // indigo
        case "Mid-Tier": return "#06b6d4";   // cyan
        default: return "#64748b";           // slate
    }
}
