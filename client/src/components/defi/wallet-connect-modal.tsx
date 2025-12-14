import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Wallet, Loader, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, walletName: string) => void;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl: string;
  detect: () => boolean;
  connect: () => Promise<string>;
}

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [step, setStep] = useState<"method" | "connecting">("method");
  const [connecting, setConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [detectedWallets, setDetectedWallets] = useState<Record<string, boolean>>({});

  // Wallet definitions
  const wallets: WalletOption[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "🦊",
      description: "Ethereum, Polygon, etc.",
      downloadUrl: "https://metamask.io/download/",
      detect: () => typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
      connect: async () => {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "phantom",
      name: "Phantom",
      icon: "👻",
      description: "Solana",
      downloadUrl: "https://phantom.app/download",
      detect: () => typeof window !== 'undefined' && !!(window as any).solana?.isPhantom,
      connect: async () => {
        const response = await (window as any).solana.connect();
        return response.publicKey.toString();
      }
    },
    {
      id: "tronlink",
      name: "TronLink",
      icon: "🔴",
      description: "Tron (TRX)",
      downloadUrl: "https://www.tronlink.org/",
      detect: () => typeof window !== 'undefined' && !!(window as any).tronLink?.ready,
      connect: async () => {
        const address = (window as any).tronLink.tronWeb.defaultAddress.base58;
        if (!address) throw new Error("No account found");
        return address;
      }
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Multi-chain wallet",
      downloadUrl: "https://trustwallet.com/download",
      detect: () => typeof window !== 'undefined' && (!!(window as any).trustwallet || !!(window as any).ethereum?.isTrust),
      connect: async () => {
        // Trust Wallet often injects as ethereum or trustwallet
        const provider = (window as any).trustwallet || (window as any).ethereum;
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "okx",
      name: "OKX Wallet",
      icon: "⚫",
      description: "Multi-chain crypto wallet",
      downloadUrl: "https://www.okx.com/web3",
      detect: () => typeof window !== 'undefined' && !!(window as any).okxwallet,
      connect: async () => {
        const accounts = await (window as any).okxwallet.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "rabby",
      name: "Rabby Wallet",
      icon: "🐰",
      description: "Better wallet for DeFi",
      downloadUrl: "https://rabby.io/",
      detect: () => typeof window !== 'undefined' && !!(window as any).rabby,
      connect: async () => {
        // Rabby usually overrides ethereum if enabled, or use specific provider
        const provider = (window as any).ethereum; 
        // Note: Rabby works via standard EIP-1193
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Mobile & Browser extension",
      downloadUrl: "https://www.coinbase.com/wallet/downloads",
      detect: () => typeof window !== 'undefined' && !!(window as any).ethereum?.isCoinbaseWallet,
      connect: async () => {
        const provider = (window as any).ethereum;
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "binance",
      name: "Binance Wallet",
      icon: "🔶",
      description: "BNB Chain wallet",
      downloadUrl: "https://www.bnbchain.org/en/binance-wallet",
      detect: () => typeof window !== 'undefined' && !!(window as any).BinanceChain,
      connect: async () => {
        const accounts = await (window as any).BinanceChain.request({ method: "eth_requestAccounts" });
        return accounts[0];
      }
    },
    {
      id: "unisat",
      name: "Unisat",
      icon: "₿",
      description: "Bitcoin Ordinals wallet",
      downloadUrl: "https://unisat.io/",
      detect: () => typeof window !== 'undefined' && !!(window as any).unisat,
      connect: async () => {
        const accounts = await (window as any).unisat.requestAccounts();
        return accounts[0];
      }
    },
    {
      id: "xverse",
      name: "Xverse",
      icon: "❎",
      description: "Bitcoin wallet for everyone",
      downloadUrl: "https://www.xverse.app/download",
      detect: () => typeof window !== 'undefined' && !!(window as any).XverseProviders,
      connect: async () => {
        const response = await (window as any).XverseProviders?.BitcoinProvider?.connect();
        return response?.address; // Note: Xverse API might differ slightly depending on version
      }
    },
    {
      id: "sui",
      name: "Sui Wallet",
      icon: "💧",
      description: "Official Sui wallet",
      downloadUrl: "https://suiwallet.com/",
      detect: () => typeof window !== 'undefined' && !!(window as any).suiWallet,
      connect: async () => {
        // Note: SUI wallet standard might require specific adapter, trying basic injection check
        // This is a simplified connect for the example, real implementation might need @mysten/dapp-kit
        if ((window as any).suiWallet?.features?.['standard:connect']) {
             const feature = (window as any).suiWallet.features['standard:connect'];
             const result = await feature.connect();
             return result.accounts[0].address;
        }
        // Fallback or older API
        const hasPermissions = await (window as any).suiWallet.hasPermissions();
        if (!hasPermissions) {
            await (window as any).suiWallet.requestPermissions();
        }
        return (await (window as any).suiWallet.getAccounts())[0];
      }
    }
  ];

  useEffect(() => {
    // Check for installed wallets
    const checkWallets = () => {
      const detected: Record<string, boolean> = {};
      wallets.forEach(wallet => {
        try {
          detected[wallet.id] = wallet.detect();
        } catch (e) {
          detected[wallet.id] = false;
        }
      });
      setDetectedWallets(detected);
    };

    checkWallets();
    // Re-check periodically in case of slow injection
    const interval = setInterval(checkWallets, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWalletClick = async (wallet: WalletOption) => {
    const isInstalled = detectedWallets[wallet.id];

    if (!isInstalled) {
      window.open(wallet.downloadUrl, "_blank");
      return;
    }

    setConnecting(true);
    setStep("connecting");
    setConnectingWallet(wallet.name);
    
    try {
      const address = await wallet.connect();
      
      if (address) {
        // Save to localStorage
        localStorage.setItem("connectedWallet", wallet.id);
        localStorage.setItem("connectedAddress", address);

        toast.success(`${wallet.name} Connected!`, {
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
        onConnect(address, wallet.id);
        onClose();
      }
    } catch (error: any) {
      setStep("method");
      // Don't show error if user rejected
      if (error.code !== 4001) {
        toast.error("Connection Failed", {
          description: error.message || `Failed to connect to ${wallet.name}`,
        });
      }
    } finally {
      setConnecting(false);
      setConnectingWallet(null);
    }
  };

  const handleClose = () => {
    setStep("method");
    setConnecting(false);
    setConnectingWallet(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md h-[80vh] sm:h-auto max-h-[85vh]"
          >
            <div className="bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full max-h-full">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-primary/20 via-blue-500/10 to-purple-500/10 border-b border-border shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-16 h-16 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-inner"
                  >
                    <Wallet className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === "method" ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Connect Wallet</h2>
                      <p className="text-muted-foreground text-sm">
                        Choose a wallet to get started
                      </p>
                    </div>

                    {/* Wallet Options Grid */}
                    <div className="grid gap-3">
                      {wallets.map((wallet) => {
                        const isInstalled = detectedWallets[wallet.id];
                        
                        return (
                          <motion.button
                            key={wallet.id}
                            whileHover={{ scale: connecting ? 1 : 1.02 }}
                            whileTap={{ scale: connecting ? 1 : 0.98 }}
                            onClick={() => handleWalletClick(wallet)}
                            disabled={connecting}
                            className={`relative w-full p-4 rounded-2xl border transition-all duration-200 group text-left flex items-center gap-4
                              ${isInstalled 
                                ? "bg-card hover:bg-accent/50 border-border hover:border-primary/30" 
                                : "bg-muted/30 border-transparent hover:bg-muted/50 opacity-80 hover:opacity-100"
                              }
                            `}
                          >
                            <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center text-2xl shrink-0">
                              {wallet.icon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold truncate">{wallet.name}</span>
                                {isInstalled && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium border border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Detected
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {wallet.description}
                              </div>
                            </div>

                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                              {isInstalled ? (
                                <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                              ) : (
                                <div className="flex items-center gap-1 text-xs font-medium bg-secondary/80 px-2 py-1 rounded-md group-hover:bg-secondary">
                                  <Download className="w-3 h-3" />
                                  Install
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Info */}
                    <div className="text-center">
                       <p className="text-xs text-muted-foreground px-4">
                        By connecting a wallet, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                         <div className="text-4xl animate-pulse">
                           {wallets.find(w => w.name === connectingWallet)?.icon || "🔗"}
                         </div>
                      </div>
                      <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Requesting Connection</h3>
                      <p className="text-muted-foreground max-w-[250px] mx-auto">
                        Please open {connectingWallet} and approve the connection request.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setStep("method")}
                      className="mt-8"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
