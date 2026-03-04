import { NextRequest, NextResponse } from "next/server";
import {
    getWalletSignatures,
    getWalletSolBalance,
    getWalletTokenAccounts,
    getSampleTransactions,
} from "@/services/alchemyClient";
import { parseWalletData } from "@/services/walletParser";
import { buildScoreSummary, classifyRiskLabel } from "@/services/scoringEngine";
import { generateIntelligence } from "@/services/aiExplainer";
import { AnalyzeResponse } from "@/types";

// Basic Solana address validation (base58, 32–44 chars)
function isValidSolanaAddress(address: string): boolean {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { address } = body;

        if (!address || typeof address !== "string") {
            return NextResponse.json<AnalyzeResponse>(
                { success: false, error: "Wallet address is required." },
                { status: 400 }
            );
        }

        const trimmed = address.trim();

        if (!isValidSolanaAddress(trimmed)) {
            return NextResponse.json<AnalyzeResponse>(
                { success: false, error: "Invalid Solana wallet address." },
                { status: 400 }
            );
        }

        // ── Step 1: Fetch wallet data from Alchemy in parallel ──────
        const [signatures, solBalanceLamports, tokenAccounts] = await Promise.all([
            getWalletSignatures(trimmed, 100),
            getWalletSolBalance(trimmed),
            getWalletTokenAccounts(trimmed),
        ]);

        // ── Step 2: Sample transactions for protocol analysis ────────
        const sampleTransactions = await getSampleTransactions(signatures, 20);

        // ── Step 3: Parse into structured wallet profile ─────────────
        const metrics = parseWalletData(
            trimmed,
            signatures,
            solBalanceLamports,
            tokenAccounts,
            sampleTransactions
        );

        // ── Step 4: Build scoring summary ────────────────────────────
        const scores = buildScoreSummary(metrics);
        const riskLabel = classifyRiskLabel(metrics.riskScore);

        // ── Step 5: Generate AI intelligence explanation ─────────────
        const { summary, bulletInsights } = await generateIntelligence(metrics, scores);

        // ── Step 6: Return complete intelligence report ──────────────
        return NextResponse.json<AnalyzeResponse>({
            success: true,
            data: {
                metrics,
                summary,
                bulletInsights,
                riskLabel,
                profileBadge: metrics.activityType,
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error: unknown) {
        console.error("[analyze] Error:", error);
        const message =
            error instanceof Error ? error.message : "Internal server error.";
        return NextResponse.json<AnalyzeResponse>(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
