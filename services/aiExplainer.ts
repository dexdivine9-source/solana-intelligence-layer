import { WalletMetrics } from "@/types";
import { ScoreSummary } from "./scoringEngine";

// ─────────────────────────────────────────────
// Model Config
// ─────────────────────────────────────────────

const MODEL = "gemini-2.5-flash"; // Extremely fast and free tier from Google
const MAX_TOKENS = 600;

// ─────────────────────────────────────────────
// Prompt Builder
// We send STRUCTURED metrics — never raw transactions.
// This is what separates an intelligence layer from a prompt wrapper.
// ─────────────────────────────────────────────

function buildPrompt(metrics: WalletMetrics, scores: ScoreSummary): string {
    return `
You are a blockchain intelligence analyst specializing in Solana on-chain behavior.
Analyze the following structured wallet metrics and produce a concise intelligence report.

WALLET PROFILE:
- Address: ${metrics.address}
- SOL Balance: ${metrics.solBalance} SOL
- Total Transactions: ${metrics.totalTransactions}
- Transaction Frequency: ${scores.transactionFrequency} (~${metrics.avgTransactionsPerDay} tx/day)
- Activity Period: ${metrics.firstActivity} to ${metrics.lastActivity} (${metrics.activeDays} active days)
- Wallet Type: ${scores.activityType}
- Whale Classification: ${scores.whaleLevel}

BEHAVIORAL METRICS:
- Protocol Exposure: ${scores.protocolBreakdown}
- Unique Protocols Used: ${metrics.uniqueProtocols}
- Token Holdings Count: ${metrics.tokenCount}
- SOL Netflow: ${metrics.netflowSol > 0 ? "+" : ""}${metrics.netflowSol} SOL

RISK INTELLIGENCE:
- Risk Score: ${scores.riskScore}/100 (${scores.riskLabel})
- Volatility Score: ${scores.volatilityScore}/100
- Diversification Score: ${scores.diversificationScore}/100
- Smart Contract Interaction Risk: ${scores.contractInteractionRisk}

OUTPUT FORMAT (follow exactly):
SUMMARY:
[Write 2-3 sentences. Concise. Professional. Analytical tone. No hype. Start with "This wallet..."]

INSIGHTS:
- [Insight about activity pattern]
- [Insight about protocol exposure or DeFi behavior]
- [Insight about risk profile]
- [Insight about whale tier or capital size]
- [Insight about diversification or concentration]

Keep language professional, factual, and grounded. No speculation. No financial advice.
`.trim();
}

// ─────────────────────────────────────────────
// Main Explainer Function (Using Native Gemini API)
// ─────────────────────────────────────────────

export async function generateIntelligence(
    metrics: WalletMetrics,
    scores: ScoreSummary
): Promise<{ summary: string; bulletInsights: string[] }> {
    const prompt = buildPrompt(metrics, scores);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: "You are a Solana blockchain intelligence analyst. Produce structured, factual, professional wallet analysis. Never speculate. Never give financial advice." }]
            },
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                maxOutputTokens: MAX_TOKENS,
                temperature: 0.4
            }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error [${response.status}]: ${errText}`);
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return parseAIResponse(raw);
}

// ─────────────────────────────────────────────
// Response Parser
// ─────────────────────────────────────────────

function parseAIResponse(raw: string): {
    summary: string;
    bulletInsights: string[];
} {
    const summaryMatch = raw.match(/SUMMARY:\s*([\s\S]*?)(?=INSIGHTS:|$)/i);
    const insightsMatch = raw.match(/INSIGHTS:\s*([\s\S]*?)$/i);

    const summary = summaryMatch?.[1]?.trim() ?? raw.trim();

    const insightsRaw = insightsMatch?.[1] ?? "";
    const bulletInsights = insightsRaw
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter((line) => line.length > 10);

    return { summary, bulletInsights };
}
