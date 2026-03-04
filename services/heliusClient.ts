import { HeliusTransaction, HeliusBalance } from "@/types";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_BASE_URL = "https://api.helius.xyz/v0";

if (!HELIUS_API_KEY) {
    console.warn("[heliusClient] ⚠️  HELIUS_API_KEY is not set in .env.local");
}

/**
 * Fetches the last N parsed transactions for a Solana wallet.
 * Helius returns enriched, human-readable transaction data — not raw instructions.
 */
export async function getWalletTransactions(
    address: string,
    limit: number = 100
): Promise<HeliusTransaction[]> {
    const url = `${HELIUS_BASE_URL}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;

    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(
            `Helius transactions error [${response.status}]: ${body}`
        );
    }

    return response.json();
}

/**
 * Fetches the current SOL + token balances for a wallet.
 */
export async function getWalletBalance(
    address: string
): Promise<HeliusBalance> {
    const url = `${HELIUS_BASE_URL}/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`;

    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(
            `Helius balance error [${response.status}]: ${body}`
        );
    }

    return response.json();
}
