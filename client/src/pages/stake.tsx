import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DeFiCard } from "@/components/defi/defi-card";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function StakePage() {
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const checkWallet = () => {
      try {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
          setWalletConnected(false);
          return;
        }
        // Check multiple ways to detect connected account
        const account = ethereum.selectedAddress || (ethereum._state && ethereum._state.accounts && ethereum._state.accounts[0]);
        const isConnected = !!(account && typeof account === 'string' && account.trim().length > 0 && account !== '0x');
        setWalletConnected(isConnected);
      } catch (e) {
        setWalletConnected(false);
      }
    };
    
    checkWallet();
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", checkWallet);
    }
    window.addEventListener("accountsChanged", checkWallet);
    
    return () => {
      window.removeEventListener("accountsChanged", checkWallet);
      if ((window as any).ethereum?.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", checkWallet);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      {!walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40"
        >
          <Card className="bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-center gap-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Connect your wallet to stake tokens
            </p>
          </Card>
        </motion.div>
      )}
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Stake Tokens
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Earn up to 14.2% APY by staking your NEX tokens
            </p>
          </motion.div>

          {/* DeFi Card - Stake Tab will be active */}
          <div className="flex justify-center">
            <DeFiCard walletConnected={walletConnected} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
