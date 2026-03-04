// ─────────────────────────────────────────────
// Helius API Types (legacy client)
// ─────────────────────────────────────────────

export interface HeliusTransaction {
  signature: string;
  type: string;
  timestamp: number;
  source: string;
  fee: number;
  feePayer: string;
  accountData: { account: string; nativeBalanceChange: number }[];
}

export interface HeliusBalance {
  nativeBalance: number;
  tokens: { mint: string; amount: number; decimals: number }[];
}

// ─────────────────────────────────────────────
// Alchemy / Solana RPC Raw Response Types
// ─────────────────────────────────────────────

/** Returned by getSignaturesForAddress */
export interface AlchemySignature {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: unknown | null;
  memo: string | null;
}

/** Returned by getTransaction (encoding: 'json') */
export interface AlchemyTransaction {
  slot: number;
  blockTime: number | null;
  transaction: {
    message: {
      accountKeys: string[];
      instructions: AlchemyInstruction[];
    };
    signatures: string[];
  };
  meta: {
    err: unknown | null;
    fee: number;
    preBalances: number[];
    postBalances: number[];
    logMessages: string[] | null;
  } | null;
}

export interface AlchemyInstruction {
  programIdIndex: number;
  accounts: number[];
  data: string;
}

/** Returned by getTokenAccountsByOwner (encoding: 'jsonParsed') */
export interface AlchemyTokenAccount {
  pubkey: string;
  account: {
    data: {
      parsed: {
        info: {
          mint: string;
          owner: string;
          tokenAmount: {
            uiAmount: number | null;
            decimals: number;
            amount: string;
          };
        };
        type: string;
      };
    };
    executable: boolean;
    lamports: number;
    owner: string;
  };
}

// ─────────────────────────────────────────────
// Parsed / Structured Wallet Profile
// ─────────────────────────────────────────────

export type ActivityType =
  | "Passive Holder"
  | "Active Trader"
  | "DeFi Yield Farmer"
  | "NFT Flipper"
  | "High-Frequency Trader"
  | "Governance Participant";

export type WhaleLevel = "Retail" | "Mid-Tier" | "Whale" | "Mega Whale";

export type TransactionFrequency = "Low" | "Medium" | "High" | "Very High";

export type RiskLabel = "Low" | "Moderate" | "High" | "Critical";

export interface ProtocolExposure {
  protocol: string;
  count: number;
  percentage: number;
  type: "DEX" | "Lending" | "Staking" | "NFT" | "Bridge" | "Other";
}

export interface WalletMetrics {
  address: string;
  solBalance: number;
  totalTransactions: number;
  transactionFrequency: TransactionFrequency;
  avgTransactionsPerDay: number;
  firstActivity: string;
  lastActivity: string;
  activeDays: number;
  whaleLevel: WhaleLevel;
  activityType: ActivityType;
  protocolExposure: ProtocolExposure[];
  topProtocol: string;
  uniqueProtocols: number;
  tokenCount: number;
  netflowSol: number;
  riskScore: number; // 0–100
  volatilityScore: number; // 0–100
  diversificationScore: number; // 0–100
  contractInteractionRisk: "Low" | "Medium" | "High";
}

// ─────────────────────────────────────────────
// Final Intelligence Report
// ─────────────────────────────────────────────

export interface WalletIntelligence {
  metrics: WalletMetrics;
  summary: string;
  bulletInsights: string[];
  riskLabel: RiskLabel;
  profileBadge: ActivityType;
  generatedAt: string;
}

// ─────────────────────────────────────────────
// API Request / Response
// ─────────────────────────────────────────────

export interface AnalyzeRequest {
  address: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: WalletIntelligence;
  error?: string;
}
