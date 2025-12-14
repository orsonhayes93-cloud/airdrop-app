import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Shield, Wallet, Zap } from "lucide-react";

const STEPS = [
  {
    title: "Connect Wallet",
    desc: "Link your MetaMask, Coinbase, or WalletConnect to start trading instantly.",
    icon: Wallet,
    color: "text-blue-500"
  },
  {
    title: "Select Network",
    desc: "We support 12+ chains including Ethereum, Arbitrum, and Base. Auto-switching included.",
    icon: Zap,
    color: "text-yellow-500"
  },
  {
    title: "Secure Trading",
    desc: "Every transaction is protected from MEV bots and front-running attacks.",
    icon: Shield,
    color: "text-green-500"
  }
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simulate checking if user has seen onboarding
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const currentStep = STEPS[step];
  const StepIcon = currentStep?.icon;

  if (!currentStep) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-primary/20 p-0 overflow-hidden gap-0">
        <div className="h-2 bg-secondary w-full">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        
        <div className="p-8">
          <DialogHeader className="mb-8">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               {StepIcon && <StepIcon className={`w-6 h-6 ${currentStep.color}`} />}
             </div>
             <DialogTitle className="text-2xl font-display font-bold">
               {currentStep.title}
             </DialogTitle>
             <DialogDescription className="text-lg mt-2">
               {currentStep.desc}
             </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-secondary"}`} 
                />
              ))}
            </div>
            
            <Button 
              onClick={() => {
                if (step < STEPS.length - 1) {
                  setStep(step + 1);
                } else {
                  setOpen(false);
                }
              }}
              className="gap-2 font-bold"
            >
              {step === STEPS.length - 1 ? (
                <>Get Started <Check className="w-4 h-4" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
