// Multi-chain configuration and registry
export type ChainName = "ethereum" | "bnb" | "solana" | "tron" | "bitcoin" | "sui";

export type TokenStandard = "ERC20" | "BEP20" | "SPL" | "TRC20" | "ARC20" | "SUI";

export interface Chain {
  id: ChainName;
  name: string;
  chainId: number; // For EVM chains
  rpcUrl: string;
  tokenStandard: TokenStandard;
  walletType: "metamask" | "phantom" | "tronlink" | "bitcoin" | "sui";
  nativeToken: string;
  explorerUrl: string;
  topTokens: Token[];
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chain: ChainName;
}

// Get RPC URL - uses default URLs for client, overridden by server env vars via API
export function getRpcUrl(chainName: ChainName, defaultUrl: string): string {
  return defaultUrl; // Client uses defaults, server provides custom via API
}

// Server-side helper to get RPC with env vars (only call from server code)
export function getServerRpcUrl(chainName: ChainName, defaultUrl: string): string {
  const envMap: Record<ChainName, string> = {
    ethereum: "ETHEREUM_RPC_URL",
    bnb: "BNB_RPC_URL",
    solana: "SOLANA_RPC_URL",
    tron: "TRON_RPC_URL",
    bitcoin: "BITCOIN_RPC_URL",
    sui: "SUI_RPC_URL",
  };
  
  // This function should only be called on server (Node.js has process.env)
  try {
    const key = envMap[chainName];
    return (process.env as any)?.[key] || defaultUrl;
  } catch {
    return defaultUrl;
  }
}

// Define all supported chains
export const CHAINS: Record<ChainName, Chain> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
    rpcUrl: getRpcUrl("ethereum", "https://eth.drpc.org"),
    tokenStandard: "ERC20",
    walletType: "metamask",
    nativeToken: "ETH",
    explorerUrl: "https://etherscan.io",
    topTokens: [
      { symbol: "WETH", name: "Wrapped Ether", address: "0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2", decimals: 18, chain: "ethereum" },
      { symbol: "USDC", name: "USD Coin", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6, chain: "ethereum" },
      { symbol: "USDT", name: "Tether", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6, chain: "ethereum" },
      { symbol: "DAI", name: "Dai Stablecoin", address: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18, chain: "ethereum" },
      { symbol: "LINK", name: "Chainlink", address: "0x514910771af9ca656af840dff83e8264ecf986ca", decimals: 18, chain: "ethereum" },
      { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", decimals: 18, chain: "ethereum" },
    ],
  },
  bnb: {
    id: "bnb",
    name: "BNB Chain",
    chainId: 56,
    rpcUrl: getRpcUrl("bnb", "https://bsc-dataseed.bnbchain.org"),
    tokenStandard: "BEP20",
    walletType: "metamask",
    nativeToken: "BNB",
    explorerUrl: "https://bscscan.com",
    topTokens: [
      { symbol: "WBNB", name: "Wrapped BNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18, chain: "bnb" },
      { symbol: "USDC", name: "USD Coin", address: "0x8AC76a51cc950d9822D68b83FE1Ad97B32Cd580d", decimals: 18, chain: "bnb" },
      { symbol: "USDT", name: "Tether", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, chain: "bnb" },
      { symbol: "BUSD", name: "Binance USD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56", decimals: 18, chain: "bnb" },
      { symbol: "ETH", name: "Ethereum", address: "0x2170Ed0880ac9A755fd29B2688956BD959e8d9a6", decimals: 18, chain: "bnb" },
      { symbol: "CAKE", name: "PancakeSwap", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a50a0DB04d", decimals: 18, chain: "bnb" },
    ],
  },
  solana: {
    id: "solana",
    name: "Solana",
    chainId: 0, // Not applicable for Solana
    rpcUrl: getRpcUrl("solana", "https://api.mainnet-beta.solana.com"),
    tokenStandard: "SPL",
    walletType: "phantom",
    nativeToken: "SOL",
    explorerUrl: "https://explorer.solana.com",
    topTokens: [
      { symbol: "SOL", name: "Solana", address: "11111111111111111111111111111111", decimals: 9, chain: "solana" },
      { symbol: "USDC", name: "USD Coin", address: "EPjFWaLb3odccccjorSzvzlnP7LogicMEiYXrn47qGA", decimals: 6, chain: "solana" },
      { symbol: "USDT", name: "Tether", address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6, chain: "solana" },
    ],
  },
  tron: {
    id: "tron",
    name: "Tron",
    chainId: 0, // Not applicable for Tron
    rpcUrl: getRpcUrl("tron", "https://api.trongrid.io"),
    tokenStandard: "TRC20",
    walletType: "tronlink",
    nativeToken: "TRX",
    explorerUrl: "https://tronscan.org",
    topTokens: [
      { symbol: "USDT", name: "Tether", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6, chain: "tron" },
      { symbol: "USDC", name: "USD Coin", address: "TEkxiTehnzSmSe2XqrBj4groupX432EfP6u", decimals: 6, chain: "tron" },
      { symbol: "BTT", name: "BitTorrent", address: "TAFjrMi8igEMsfvznKaFjDwbHJTX5v1jX9", decimals: 6, chain: "tron" },
    ],
  },
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    chainId: 0,
    rpcUrl: getRpcUrl("bitcoin", "https://blockstream.info/api"),
    tokenStandard: "ARC20",
    walletType: "bitcoin",
    nativeToken: "BTC",
    explorerUrl: "https://blockstream.info",
    topTokens: [
      { symbol: "BTC", name: "Bitcoin", address: "0x0000000000000000000000000000000000000000", decimals: 8, chain: "bitcoin" },
    ],
  },
  sui: {
    id: "sui",
    name: "SUI",
    chainId: 0,
    rpcUrl: getRpcUrl("sui", "https://fullnode.mainnet.sui.io:443"),
    tokenStandard: "SUI",
    walletType: "sui",
    nativeToken: "SUI",
    explorerUrl: "https://explorer.sui.io",
    topTokens: [
      { symbol: "SUI", name: "SUI", address: "0x2::sui::SUI", decimals: 9, chain: "sui" },
      { symbol: "USDC", name: "USD Coin", address: "0x5d4b302506645c37ff133b98c4b50864ee495acd736186ad0140626331b8d3b7::coin::COIN", decimals: 6, chain: "sui" },
    ],
  },
};

// Helper functions
export function getChain(chainName: ChainName): Chain {
  return CHAINS[chainName];
}

export function getAllChains(): Chain[] {
  return Object.values(CHAINS);
}

export function getChainByName(name: string): Chain | null {
  return Object.values(CHAINS).find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

export function getTokensByChain(chainName: ChainName): Token[] {
  return CHAINS[chainName]?.topTokens || [];
}
