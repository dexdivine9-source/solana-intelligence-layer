"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletIntelligence } from "@/types";
import IntelligenceSummary from "@/components/IntelligenceSummary";
import MetricCard from "@/components/MetricCard";
import ProtocolBreakdown from "@/components/ProtocolBreakdown";
import RiskPanel from "@/components/RiskPanel";

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState<WalletIntelligence | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("intelligence");
        if (!raw) {
            router.replace("/");
            return;
        }
        try {
            setData(JSON.parse(raw));
        } catch {
            router.replace("/");
        }
    }, [router]);

    if (!data) {
        return (
            <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 1.5s linear infinite", display: "inline-block" }}>◌</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading intelligence report...</p>
                </div>
                <style jsx global>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
            </main>
        );
    }

    const { metrics, summary, bulletInsights, riskLabel, profileBadge, generatedAt } = data;

    const netflowStr = metrics.netflowSol >= 0
        ? `+${metrics.netflowSol} SOL`
        : `${metrics.netflowSol} SOL`;

    return (
        <main style={{ minHeight: "100vh", position: "relative" }}>

            {/* Background */}
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.3 }} />
            <div style={{
                position: "fixed", top: "-15%", right: "-10%",
                width: "500px", height: "500px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                zIndex: 0, pointerEvents: "none",
            }} />

            {/* Nav */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 32px",
                borderBottom: "1px solid var(--border-subtle)",
                backdropFilter: "blur(20px)",
                background: "rgba(8,8,18,0.8)"
            }}>
                <button
                    onClick={() => router.push("/")}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", fontSize: "13px",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                    ← New Analysis
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "7px", background: "linear-gradient(135deg, #7c3aed, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>◈</div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>SolIntel</span>
                </div>

                <span className="badge badge-violet" style={{ fontSize: "11px" }}>
                    Tier 1 Intelligence
                </span>
            </nav>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>

                {/* Page Title */}
                <div className="animate-fade-in-up" style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                        <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, letterSpacing: "0.08em" }}>LIVE INTELLIGENCE REPORT</span>
                    </div>
                    <h1 className="gradient-text-violet" style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                        Wallet Intelligence Report
                    </h1>
                    <p className="font-mono" style={{ fontSize: "13px", color: "var(--text-muted)", wordBreak: "break-all" }}>
                        {metrics.address}
                    </p>
                </div>

                {/* Intelligence Summary */}
                <div style={{ marginBottom: "24px" }}>
                    <IntelligenceSummary
                        summary={summary}
                        bulletInsights={bulletInsights}
                        riskLabel={riskLabel}
                        profileBadge={profileBadge}
                        address={metrics.address}
                        generatedAt={generatedAt}
                    />
                </div>

                {/* Key Metrics Grid */}
                <div style={{ marginBottom: "24px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                        Key Metrics
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "14px",
                    }}>
                        <MetricCard
                            label="SOL Balance"
                            value={`${metrics.solBalance} SOL`}
                            icon="◎"
                            accentColor="#a78bfa"
                            delay={1}
                        />
                        <MetricCard
                            label="Total Transactions"
                            value={metrics.totalTransactions.toLocaleString()}
                            subLabel={`~${metrics.avgTransactionsPerDay} tx/day`}
                            icon="⇌"
                            accentColor="#22d3ee"
                            delay={2}
                        />
                        <MetricCard
                            label="Whale Tier"
                            value={metrics.whaleLevel}
                            icon="🐋"
                            accentColor={
                                metrics.whaleLevel === "Mega Whale" ? "#a855f7" :
                                    metrics.whaleLevel === "Whale" ? "#6366f1" :
                                        metrics.whaleLevel === "Mid-Tier" ? "#06b6d4" : "#64748b"
                            }
                            delay={3}
                        />
                        <MetricCard
                            label="Activity Profile"
                            value={metrics.activityType}
                            icon="◈"
                            accentColor="#a78bfa"
                            delay={4}
                        />
                        <MetricCard
                            label="TX Frequency"
                            value={metrics.transactionFrequency}
                            subLabel={`${metrics.activeDays} active days`}
                            icon="⚡"
                            accentColor={metrics.transactionFrequency === "Very High" ? "#ef4444" : metrics.transactionFrequency === "High" ? "#f97316" : "#22c55e"}
                            delay={5}
                        />
                        <MetricCard
                            label="SOL Netflow"
                            value={netflowStr}
                            subLabel={`${metrics.tokenCount} tokens held`}
                            icon="↕"
                            accentColor={metrics.netflowSol >= 0 ? "#22c55e" : "#ef4444"}
                            trend={metrics.netflowSol > 0 ? "up" : metrics.netflowSol < 0 ? "down" : "neutral"}
                            delay={5}
                        />
                    </div>
                </div>

                {/* Protocol + Risk Side by Side */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                }}>
                    <ProtocolBreakdown protocols={metrics.protocolExposure} />
                    <RiskPanel
                        riskScore={metrics.riskScore}
                        volatilityScore={metrics.volatilityScore}
                        diversificationScore={metrics.diversificationScore}
                        riskLabel={riskLabel}
                        contractInteractionRisk={metrics.contractInteractionRisk}
                    />
                </div>

                {/* Timeline Footer */}
                <div className="card animate-fade-in-up" style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                        Activity Timeline
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "200px" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet-500)" }} />
                            <div>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>First Activity</p>
                                <p className="font-mono" style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600 }}>{metrics.firstActivity}</p>
                            </div>
                        </div>

                        <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, var(--violet-500), var(--cyan-500))", minWidth: "60px" }} />

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "200px", justifyContent: "flex-end" }}>
                            <div>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>Last Activity</p>
                                <p className="font-mono" style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, textAlign: "right" }}>{metrics.lastActivity}</p>
                            </div>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cyan-500)" }} />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {[
                            { label: "Active Days", value: metrics.activeDays },
                            { label: "Unique Protocols", value: metrics.uniqueProtocols },
                            { label: "Top Protocol", value: metrics.topProtocol },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{stat.label}</p>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <p style={{ marginTop: "24px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
                    Intelligence generated by SolIntel · Powered by Helius + GPT-4o-mini · Not financial advice
                </p>
            </div>

            <style jsx global>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
        </main>
    );
}
