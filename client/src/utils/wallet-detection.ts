// Multi-wallet detection utility
import type { ChainName } from "@shared/chains";

export interface WalletInfo {
  chain: ChainName;
  address: string;
  wallet: string; // metamask, phantom, tronlink, etc.
  isConnected: boolean;
}

export async function detectMetaMask(): Promise<WalletInfo | null> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;
  
  try {
    const address = ethereum.selectedAddress;
    if (address) {
      return {
        chain: "ethereum",
        address,
        wallet: "metamask",
        isConnected: true,
      };
    }
  } catch (e) {}
  return null;
}

export async function detectBNBChain(): Promise<WalletInfo | null> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;
  
  try {
    const chainHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainHex, 16);
    if (chainId === 56) {
      const address = ethereum.selectedAddress;
      if (address) {
        return {
          chain: "bnb",
          address,
          wallet: "metamask",
          isConnected: true,
        };
      }
    }
  } catch (e) {}
  return null;
}

export async function detectPhantom(): Promise<WalletInfo | null> {
  const phantom = (window as any).solana;
  if (!phantom?.isPhantom) return null;
  
  try {
    const publicKey = phantom.publicKey;
    
    if (publicKey) {
      return {
        chain: "solana",
        address: publicKey.toString(),
        wallet: "phantom",
        isConnected: true,
      };
    }
  } catch (e) {}
  return null;
}

export async function detectTronLink(): Promise<WalletInfo | null> {
  const tronLink = (window as any).tronLink;
  if (!tronLink) return null;
  
  try {
    if (tronLink.ready && tronLink.tronWeb) {
      const address = tronLink.tronWeb.defaultAddress?.base58;
      if (address) {
        return {
          chain: "tron",
          address,
          wallet: "tronlink",
          isConnected: true,
        };
      }
    }
  } catch (e) {}
  return null;
}

export async function detectBitcoinWallet(): Promise<WalletInfo | null> {
  const bitcoin = (window as any).bitcoin;
  if (!bitcoin) return null;
  
  try {
    if (bitcoin.enable) {
      const addresses = await bitcoin.getAddresses();
      if (addresses && addresses.length > 0) {
        return {
          chain: "bitcoin",
          address: addresses[0],
          wallet: "bitcoin",
          isConnected: true,
        };
      }
    }
  } catch (e) {}
  return null;
}

export async function detectSUIWallet(): Promise<WalletInfo | null> {
  const sui = (window as any).suiWallet;
  if (!sui) return null;
  
  try {
    if (sui.isConnected && sui.getAddress) {
      const address = await sui.getAddress();
      if (address) {
        return {
          chain: "sui",
          address,
          wallet: "sui",
          isConnected: true,
        };
      }
    }
  } catch (e) {}
  return null;
}

export async function detectAllWallets(): Promise<WalletInfo[]> {
  const wallets: WalletInfo[] = [];
  
  const metamask = await detectMetaMask();
  if (metamask) wallets.push(metamask);
  
  const bnb = await detectBNBChain();
  if (bnb) wallets.push(bnb);
  
  const phantom = await detectPhantom();
  if (phantom) wallets.push(phantom);
  
  const tronlink = await detectTronLink();
  if (tronlink) wallets.push(tronlink);
  
  const bitcoin = await detectBitcoinWallet();
  if (bitcoin) wallets.push(bitcoin);
  
  const sui = await detectSUIWallet();
  if (sui) wallets.push(sui);
  
  return wallets;
}

export function getWalletByChain(wallets: WalletInfo[], chain: ChainName): WalletInfo | null {
  return wallets.find(w => w.chain === chain) || null;
}
