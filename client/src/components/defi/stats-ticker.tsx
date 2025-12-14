import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MOCK_ACTIVITIES = [
  { type: "Swap", user: "0x3a...9f2", from: "ETH", to: "USDC", val: "$4,200" },
  { type: "Stake", user: "0x8b...1c4", from: "NEX", to: "Pool", val: "$12,500" },
  { type: "Swap", user: "0x1c...22a", from: "WBTC", to: "ETH", val: "$8,900" },
  { type: "Airdrop", user: "0x9d...44e", from: "Protocol", to: "User", val: "$500" },
  { type: "Swap", user: "0x5f...88b", from: "USDC", to: "NEX", val: "$1,200" },
  { type: "Stake", user: "0x2a...11c", from: "ETH", to: "Lido", val: "$32,000" },
];

export function StatsTicker() {
  return (
    <div className="w-full bg-secondary/30 border-y border-border/50 overflow-hidden py-2 backdrop-blur-sm">
      <div className="flex items-center gap-8 whitespace-nowrap">
        <motion.div 
          className="flex items-center gap-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...MOCK_ACTIVITIES, ...MOCK_ACTIVITIES, ...MOCK_ACTIVITIES].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-mono">
              <span className={`
                w-2 h-2 rounded-full 
                ${item.type === 'Swap' ? 'bg-blue-500 shadow-[0_0_8px_blue]' : 
                  item.type === 'Stake' ? 'bg-purple-500 shadow-[0_0_8px_purple]' : 
                  'bg-primary shadow-[0_0_8px_hsl(var(--primary))]'}
              `} />
              <span className="text-muted-foreground">{item.user}</span>
              <span className="text-foreground font-bold">{item.type}</span>
              <span className="text-muted-foreground">{item.from} → {item.to}</span>
              <span className="text-primary font-bold">{item.val}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
