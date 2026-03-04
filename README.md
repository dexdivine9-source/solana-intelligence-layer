# Solana Intelligence Layer 🧠

A powerful AI-driven application that translates raw, complex Solana blockchain data into instant, human-readable intelligence reports and risk profiles.

## The Problem It Solves
Blockchain data is fundamentally open, but it is **not legible**. If you look up a wallet on a raw explorer like Solscan, you are met with a massive, messy list of transaction hashes, raw signature bytes, and token transfers. 

To understand what a wallet is *actually* doing, an analyst must spend hours manually tracing transactions, digging into smart contracts, and establishing a behavioral pattern.

## The Solution
The **Solana Intelligence Layer** automates hours of manual data labor into a 5-second automatic process. By simply pasting a wallet address, the application aggregates the raw data and provides:

1. **Behavioral Profiling:** Instantly categorizes the wallet type (e.g., "Active DeFi User", "Airdrop Farmer") by calculating average transactions per day, active time periods, and total volume.
2. **Risk & Protocol Scoring:** Generates a unified Risk Score (/100) determining if a wallet interacts with high-risk smart contracts, lacks diversification, or transacts unnaturally fast.
3. **AI Translation (The "Intelligence" Layer):** Acts as a bridge between data and human decision-making. By structuring calculated metrics and feeding them into our LLM endpoint, the application synthesizes cold data into plain-English behavioral insights.

---

## Architecture & Tech Stack
![Intelligence Panel Example](https://github.com/user-attachments/assets/demo-placeholder) *(Replace placeholder later)*

* **Frontend:** Next.js (App Router), React, TailwindCSS + Framer Motion (Glassmorphism UX)
* **On-Chain Data:** Alchemy Solana RPC (Batch-requesting Signatures, Balances, & Transactions)
* **AI Inference:** Google Gemini API (Using `gemini-2.5-flash` for high-speed, cost-effective programmatic summarization).

## Local Development

If you'd like to run a local instance of the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/dexdivine9-source/solana-intelligence-layer.git
   cd solana-intelligence-layer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your API Keys:
   ```env
   ALCHEMY_SOLANA_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_KEY
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Design Philosophy

This project was built with a strict emphasis on dark-mode aesthetics, responsive UI components, and the "Glassmorphism" design trend to give the application a premium, institutional-grade feel suited for high-level technical traders or protocol risk analysts.
