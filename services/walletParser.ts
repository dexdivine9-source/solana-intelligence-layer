import {
    AlchemySignature,
    AlchemyTransaction,
    AlchemyTokenAccount,
    WalletMetrics,
    ActivityType,
    WhaleLevel,
    TransactionFrequency,
    ProtocolExposure,
} from "@/types";

// ─────────────────────────────────────────────
// Known Solana Program ID → Protocol Map
// Used to classify on-chain behavior from raw tx data
// ─────────────────────────────────────────────

const KNOWN_PROGRAMS: Record<
    string,
    { name: string; type: ProtocolExposure["type"] }
> = {
    // DEX
    JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: { name: "Jupiter", type: "DEX" },
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": { name: "Raydium AMM", type: "DEX" },
    RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr: { name: "Raydium CLMM", type: "DEX" },
    "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": { name: "Orca", type: "DEX" },
    whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: { name: "Orca Whirlpools", type: "DEX" },
    srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX: { name: "Serum", type: "DEX" },
    MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2pgJe: { name: "Mercurial", type: "DEX" },
    // NFT
    M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K: { name: "Magic Eden", type: "NFT" },
    TSWAPaqyCSx2KABk68Shruf4rp7CxcAi9von1iALbrj: { name: "Tensor", type: "NFT" },
    CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz: { name: "Solanart", type: "NFT" },
    // Staking
    MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: { name: "Marinade", type: "Staking" },
    Stake11111111111111111111111111111111111111: { name: "Native Stake", type: "Staking" },
    CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxPQbPTe: { name: "Lido", type: "Staking" },
    // Lending
    So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo: { name: "Solend", type: "Lending" },
    "4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg": { name: "Mango Markets", type: "Lending" },
    Port7uDYB3wTKTys1MmQdMCrheoxPFTSPYZoBaBKcD6n: { name: "Port Finance", type: "Lending" },
    // Bridge
    worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth: { name: "Wormhole", type: "Bridge" },
};

// Infrastructure programs to skip — they add noise, not signal
const NOISE_PROGRAMS = new Set([
    "11111111111111111111111111111111",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bpb",
    "ComputeBudget111111111111111111111111111111",
]);

function classifyProgramId(
    programId: string
): { name: string; type: ProtocolExposure["type"] } | null {
    if (NOISE_PROGRAMS.has(programId)) return null;
    if (programId in KNOWN_PROGRAMS) return KNOWN_PROGRAMS[programId];
    // Unknown non-native program = unclassified on-chain interaction
    return { name: "Unknown Contract", type: "Other" };
}

// ─────────────────────────────────────────────
// Core Parser
// ─────────────────────────────────────────────

export function parseWalletData(
    address: string,
    signatures: AlchemySignature[],
    solBalanceLamports: number,
    tokenAccounts: AlchemyTokenAccount[],
    sampleTransactions: (AlchemyTransaction | null)[]
): WalletMetrics {
    const solBalance = solBalanceLamports / 1e9;
    const total = signatures.length;

    // ── Time Analysis ──────────────────────────
    const timestamps = signatures
        .map((s) => s.blockTime)
        .filter((t): t is number => t !== null)
        .sort((a, b) => a - b);

    const firstTs = timestamps[0] ?? Date.now() / 1000;
    const lastTs = timestamps[timestamps.length - 1] ?? Date.now() / 1000;
    const firstActivity = new Date(firstTs * 1000).toISOString().split("T")[0];
    const lastActivity = new Date(lastTs * 1000).toISOString().split("T")[0];

    const spanDays = Math.max(1, Math.ceil((lastTs - firstTs) / 86400));
    const activeDays = new Set(
        timestamps.map((ts) => new Date(ts * 1000).toISOString().split("T")[0])
    ).size;
    const avgTransactionsPerDay = parseFloat((total / spanDays).toFixed(2));

    // ── Protocol Exposure (from sampled transactions) ──────────────
    const protocolCounts: Record<
        string,
        { count: number; type: ProtocolExposure["type"] }
    > = {};

    for (const tx of sampleTransactions) {
        if (!tx) continue;
        const accountKeys = tx.transaction?.message?.accountKeys ?? [];
        const instructions = tx.transaction?.message?.instructions ?? [];
        const programIds = new Set(
            instructions.map((ix) => accountKeys[ix.programIdIndex]).filter(Boolean)
        );

        for (const programId of programIds) {
            const classified = classifyProgramId(programId);
            if (!classified) continue; // skip infrastructure noise
            const key = classified.name;
            if (!protocolCounts[key]) {
                protocolCounts[key] = { count: 0, type: classified.type };
            }
            protocolCounts[key].count++;
        }
    }

    const sampleSize = Math.max(sampleTransactions.filter(Boolean).length, 1);
    const protocolExposure: ProtocolExposure[] = Object.entries(protocolCounts)
        .map(([name, { count, type }]) => ({
            protocol: name,
            count,
            percentage: parseFloat(((count / sampleSize) * 100).toFixed(1)),
            type,
        }))
        .sort((a, b) => b.count - a.count);

    const topProtocol = protocolExposure[0]?.protocol ?? "Unknown";
    const uniqueProtocols = protocolExposure.filter(
        (p) => p.type !== "Other"
    ).length;

    // ── Netflow (SOL) from sampled txs ────────────────────────────
    let netflowLamports = 0;
    for (const tx of sampleTransactions) {
        if (!tx?.meta) continue;
        const accountKeys = tx.transaction?.message?.accountKeys ?? [];
        const walletIdx = accountKeys.indexOf(address);
        if (walletIdx === -1) continue;
        netflowLamports +=
            (tx.meta.postBalances[walletIdx] ?? 0) -
            (tx.meta.preBalances[walletIdx] ?? 0);
    }
    const netflowSol = parseFloat((netflowLamports / 1e9).toFixed(4));

    // ── Token Count ───────────────────────────
    const tokenCount = tokenAccounts.length;

    // ── Frequency Classification ───────────────
    let transactionFrequency: TransactionFrequency;
    if (avgTransactionsPerDay >= 20) transactionFrequency = "Very High";
    else if (avgTransactionsPerDay >= 5) transactionFrequency = "High";
    else if (avgTransactionsPerDay >= 1) transactionFrequency = "Medium";
    else transactionFrequency = "Low";

    // ── Whale Classification ───────────────────
    let whaleLevel: WhaleLevel;
    if (solBalance >= 100000) whaleLevel = "Mega Whale";
    else if (solBalance >= 10000) whaleLevel = "Whale";
    else if (solBalance >= 500) whaleLevel = "Mid-Tier";
    else whaleLevel = "Retail";

    // ── Activity Type ──────────────────────────
    const dexCount = protocolExposure.filter((p) => p.type === "DEX").reduce((a, p) => a + p.count, 0);
    const nftCount = protocolExposure.filter((p) => p.type === "NFT").reduce((a, p) => a + p.count, 0);
    const stakingCount = protocolExposure.filter((p) => p.type === "Staking").reduce((a, p) => a + p.count, 0);
    const lendingCount = protocolExposure.filter((p) => p.type === "Lending").reduce((a, p) => a + p.count, 0);
    const maxCount = Math.max(dexCount, nftCount, stakingCount, lendingCount);

    let activityType: ActivityType;
    if (avgTransactionsPerDay >= 15 && dexCount > 0) activityType = "High-Frequency Trader";
    else if (maxCount === dexCount && dexCount > 0) activityType = "Active Trader";
    else if (maxCount === nftCount && nftCount > 0) activityType = "NFT Flipper";
    else if (maxCount === stakingCount && stakingCount > 0) activityType = "DeFi Yield Farmer";
    else if (maxCount === lendingCount && lendingCount > 0) activityType = "DeFi Yield Farmer";
    else activityType = "Passive Holder";

    // ── Scores ────────────────────────────────
    const riskScore = computeRiskScore({ avgTransactionsPerDay, uniqueProtocols, protocolExposure, total });
    const volatilityScore = computeVolatilityScore({ avgTransactionsPerDay, netflowSol, solBalance });
    const diversificationScore = computeDiversificationScore({ tokenCount, uniqueProtocols, protocolExposure });

    // ── Contract Risk ─────────────────────────
    const unknownCount = protocolCounts["Unknown Contract"]?.count ?? 0;
    const unknownRatio = unknownCount / Math.max(sampleSize, 1);
    const contractInteractionRisk =
        unknownRatio > 0.5 ? "High" : unknownRatio > 0.2 ? "Medium" : "Low";

    return {
        address,
        solBalance: parseFloat(solBalance.toFixed(4)),
        totalTransactions: total,
        transactionFrequency,
        avgTransactionsPerDay,
        firstActivity,
        lastActivity,
        activeDays,
        whaleLevel,
        activityType,
        protocolExposure,
        topProtocol,
        uniqueProtocols,
        tokenCount,
        netflowSol,
        riskScore,
        volatilityScore,
        diversificationScore,
        contractInteractionRisk,
    };
}

// ─────────────────────────────────────────────
// Scoring Helpers (unchanged logic)
// ─────────────────────────────────────────────

function computeRiskScore({
    avgTransactionsPerDay,
    uniqueProtocols,
    protocolExposure,
    total,
}: {
    avgTransactionsPerDay: number;
    uniqueProtocols: number;
    protocolExposure: ProtocolExposure[];
    total: number;
}): number {
    let score = 0;
    if (avgTransactionsPerDay >= 20) score += 30;
    else if (avgTransactionsPerDay >= 10) score += 20;
    else if (avgTransactionsPerDay >= 3) score += 10;

    const unknownPct = protocolExposure.find((p) => p.protocol === "Unknown Contract")?.percentage ?? 0;
    score += Math.min(unknownPct * 0.5, 30);

    if (uniqueProtocols <= 1) score += 20;
    else if (uniqueProtocols <= 3) score += 10;

    if (total < 5) score += 10;
    return Math.min(100, Math.round(score));
}

function computeVolatilityScore({
    avgTransactionsPerDay,
    netflowSol,
    solBalance,
}: {
    avgTransactionsPerDay: number;
    netflowSol: number;
    solBalance: number;
}): number {
    let score = 0;
    if (avgTransactionsPerDay >= 20) score += 40;
    else if (avgTransactionsPerDay >= 10) score += 25;
    else if (avgTransactionsPerDay >= 3) score += 15;

    const netflowRatio = Math.abs(netflowSol) / Math.max(solBalance, 1);
    score += Math.min(netflowRatio * 20, 40);
    return Math.min(100, Math.round(score));
}

function computeDiversificationScore({
    tokenCount,
    uniqueProtocols,
    protocolExposure,
}: {
    tokenCount: number;
    uniqueProtocols: number;
    protocolExposure: ProtocolExposure[];
}): number {
    let score = 0;
    score += Math.min(tokenCount * 5, 40);
    score += Math.min(uniqueProtocols * 8, 40);
    const uniqueTypes = new Set(protocolExposure.map((p) => p.type)).size;
    score += uniqueTypes * 5;
    return Math.min(100, Math.round(score));
}
