import { AlchemySignature, AlchemyTransaction, AlchemyTokenAccount } from "@/types";

// ─────────────────────────────────────────────
// Alchemy Solana RPC Client
// Endpoint: https://solana-mainnet.g.alchemy.com/v2/{API_KEY}
// ─────────────────────────────────────────────

const ALCHEMY_SOLANA_URL = process.env.ALCHEMY_SOLANA_URL;

if (!ALCHEMY_SOLANA_URL) {
    console.warn("[alchemyClient] ⚠️  ALCHEMY_SOLANA_URL is not set in .env.local");
}

// Core JSON-RPC caller
async function rpc<T>(method: string, params: unknown[]): Promise<T> {
    const response = await fetch(ALCHEMY_SOLANA_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        next: { revalidate: 0 },
    });

    if (!response.ok) {
        throw new Error(`Alchemy HTTP error [${response.status}]`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Alchemy RPC error: ${data.error.message}`);
    }

    return data.result as T;
}

// ─────────────────────────────────────────────
// Public API Functions
// ─────────────────────────────────────────────

/**
 * Returns up to `limit` transaction signatures for a wallet, newest first.
 * Each item contains blockTime (Unix timestamp) and confirmation status.
 */
export async function getWalletSignatures(
    address: string,
    limit = 100
): Promise<AlchemySignature[]> {
    return rpc<AlchemySignature[]>("getSignaturesForAddress", [
        address,
        { limit },
    ]);
}

/**
 * Returns the SOL balance in lamports.
 */
export async function getWalletSolBalance(address: string): Promise<number> {
    const result = await rpc<{ value: number } | null>("getBalance", [address]);
    return result?.value ?? 0;
}

/**
 * Returns all SPL token accounts owned by the wallet.
 */
export async function getWalletTokenAccounts(
    address: string
): Promise<AlchemyTokenAccount[]> {
    const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    const result = await rpc<{ value: AlchemyTokenAccount[] } | null>(
        "getTokenAccountsByOwner",
        [address, { programId: TOKEN_PROGRAM }, { encoding: "jsonParsed" }]
    );
    return result?.value ?? [];
}

/**
 * Fetches a single transaction by signature.
 * Uses `json` encoding for consistent accountKeys as string[].
 * maxSupportedTransactionVersion: 0 handles both legacy and v0 txs.
 */
export async function getTransactionDetails(
    signature: string
): Promise<AlchemyTransaction | null> {
    return rpc<AlchemyTransaction | null>("getTransaction", [
        signature,
        { encoding: "json", maxSupportedTransactionVersion: 0 },
    ]);
}

/**
 * Batch-fetches a sample of transactions for protocol analysis.
 * We sample up to `count` txs — enough for protocol profiling without hammering the API.
 */
export async function getSampleTransactions(
    signatures: AlchemySignature[],
    count = 20
): Promise<(AlchemyTransaction | null)[]> {
    const sample = signatures.slice(0, count);
    return Promise.all(sample.map((s) => getTransactionDetails(s.signature)));
}
