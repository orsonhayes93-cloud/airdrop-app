import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { hubConfig } from "../config/hub-config"; 
import { useAppKit } from '@reown/appkit/react'; // 1. Import the official trigger
import { Button } from "@/components/ui/button"; // Standard button
import { Terminal } from "lucide-react";

export default function HubPage() {
  const [match, params] = useRoute("/hub/:id");
  const hubId = params?.id;
  
  // 2. Initialize the "Open" function
  const { open } = useAppKit();

  const currentHub = hubConfig.find((h) => h.id === Number(hubId));

  if (!currentHub) {
    return (
      <div className="h-screen bg-black text-red-500 flex items-center justify-center font-mono uppercase text-xs tracking-widest">
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
      {/* Header */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tighter" style={{ color: currentHub.color }}>
          {currentHub.title}
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">{currentHub.description}</p>
      </div>

      {/* Main Action Card */}
      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 shadow-2xl border-t-2 overflow-hidden" style={{ borderTopColor: currentHub.color }}>
        <div className="p-4 mb-8 rounded-xl bg-black/60 border border-[#222] font-mono text-[10px] space-y-1">
          <p className="text-emerald-500/60">{'>'} SYSTEM_READY: v2.0.26</p>
          <p className="font-bold text-white/90 uppercase">{'>'} TARGET_HUB: {currentHub.title}</p>
          <p className="animate-pulse text-emerald-400">{'>'} AWAITING_SECURE_SIGNATURE...</p>
        </div>
        
        {/* 3. The Functional Button */}
        <Button 
          onClick={() => open()} 
          className="w-full py-7 text-lg font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          style={{ backgroundColor: currentHub.color, color: '#000' }}
        >
          Connect Wallet
        </Button>
      </div>
      
      <div className="mt-12 opacity-20 text-[9px] uppercase tracking-[0.6em] font-medium">
        VndrSync Security Node
      </div>
    </motion.div>
  );
}
