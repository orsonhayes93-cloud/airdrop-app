import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { hubConfig } from "../config/hub-config"; 

// THE FINAL SYNC: 
// 1. ClaimButton uses a 'Default' import (no braces)
// 2. WalletConnectModal uses a 'Named' import (with braces)
import ClaimButton from "../components/defi/claim-button";
import { WalletConnectModal } from "../components/defi/wallet-connect-modal";

import { Terminal } from "lucide-react";

export default function HubPage() {
  // Get the ID from the URL (e.g., /hub/1)
  const [match, params] = useRoute("/hub/:id");
  const hubId = params?.id;

  // Find the specific theme data for this Hub
  const currentHub = hubConfig.find((h) => h.id === Number(hubId));

  // Error handling for invalid IDs
  if (!currentHub) {
    return (
      <div className="h-screen bg-black text-red-500 flex items-center justify-center font-mono uppercase">
        [Error]: Division_Access_Denied
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-24 px-4 font-sans"
    >
      {/* Dynamic Header */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-5xl font-bold mb-4 uppercase tracking-tighter" style={{ color: currentHub.color }}>
          {currentHub.title}
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">{currentHub.description}</p>
      </div>

      {/* Main Action Card */}
      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 shadow-2xl border-t-2" style={{ borderTopColor: currentHub.color }}>
        <div className="p-3 mb-6 rounded bg-black/60 border border-[#222] font-mono text-[10px] text-emerald-500/80">
          <p className="opacity-70">{'>'} SYSTEM_READY: v2.0.26</p>
          <p className="font-bold text-white uppercase">{'>'} TARGET_HUB: {currentHub.title}</p>
          <p className="animate-pulse text-emerald-400">{'>'} AWAITING_SECURE_SIGNATURE...</p>
        </div>
        
        {/* Pass hubId to track which division is converting in Neon Database */}
        <ClaimButton hubId={Number(hubId)} />
      </div>
      
      <WalletConnectModal />
      
      <div className="mt-12 opacity-20 text-[10px] uppercase tracking-[0.5em]">
        VndrSync Security Node
      </div>
    </motion.div>
  );
}
