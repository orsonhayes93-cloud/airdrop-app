import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: string;
  role: "user" | "agent";
  text: string;
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "agent", text: "Hello! I'm Nexus AI. I can help you analyze your portfolio, suggest swap routes, or explain DeFi concepts. How can I assist you today?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "agent", 
        text: "I've analyzed the current market conditions. ETH is showing strong momentum. Would you like me to simulate a swap from USDC to ETH?" 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[350px] h-[500px] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-primary/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold font-display text-sm">Nexus AI Agent</div>
                  <div className="text-[10px] text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8 border border-border">
                      {msg.role === "agent" ? (
                        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-secondary text-foreground"><User className="w-4 h-4" /></AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-secondary text-secondary-foreground rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border bg-background/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about yields, swaps..." 
                  className="pr-10 bg-secondary/50 border-transparent focus-visible:ring-primary"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1 top-1 h-8 w-8 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] hover:scale-110 transition-all duration-300 p-0 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
