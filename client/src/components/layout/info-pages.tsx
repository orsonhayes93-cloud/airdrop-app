import { motion } from "framer-motion";
import { 
  FileText, 
  Users, 
  Mail, 
  HelpCircle, 
  Coins, 
  ArrowRight, 
  ShieldCheck,
  Globe,
  Zap,
  TrendingUp,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function InfoPages() {
  return (
    <div className="space-y-32 py-20">
      
      {/* About Us Section */}
      <section id="about" className="scroll-mt-20 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
              About Nexus
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">Building the Future of Finance</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nexus was founded in 2024 with a singular mission: to democratize access to institutional-grade financial tools. We believe that decentralized finance shouldn't be complex or risky.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { icon: Users, label: "150k+ Users" },
                { icon: Globe, label: "Global Reach" },
                { icon: ShieldCheck, label: "Audited Code" },
                { icon: Zap, label: "Zero Latency" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-20 blur-3xl rounded-full" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-primary/20 p-8 space-y-6">
              <h3 className="text-2xl font-bold font-display">Our Mission</h3>
              <p className="text-muted-foreground">
                To create a financial ecosystem that is transparent, accessible, and efficient for everyone, everywhere.
              </p>
              <Button className="w-full bg-primary text-primary-foreground font-bold">Join Our Team</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="scroll-mt-20 container mx-auto px-4 relative overflow-hidden">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-bold mb-6">$NEX Tokenomics</h2>
          <p className="text-muted-foreground text-lg">
            The heartbeat of the Nexus ecosystem. Designed for long-term sustainability and community governance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Total Supply", val: "1,000,000,000", desc: "Fixed supply, deflationary mechanics.", icon: Coins },
            { title: "Staking APY", val: "Up to 14.2%", desc: "Real yield from protocol revenue.", icon: TrendingUp },
            { title: "Governance", val: "DAO Control", desc: "1 Token = 1 Vote on proposals.", icon: Users },
          ].map((card, i) => (
            <Card key={i} className="p-8 bg-secondary/20 border-primary/10 hover:border-primary/30 transition-all text-center group">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <card.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <div className="text-3xl font-mono font-bold text-primary mb-2">{card.val}</div>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-20 container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "Is Nexus safe to use?", a: "Yes, our smart contracts have been audited by Certik and Trail of Bits. We also maintain a $2M insurance fund." },
            { q: "How do I stake my tokens?", a: "Simply connect your wallet, navigate to the Earn tab, and select the Staking pool. Approve the transaction and you're set." },
            { q: "What networks do you support?", a: "We currently support Ethereum, Arbitrum, Optimism, Polygon, and Base. More chains are coming soon." },
            { q: "What is the fee structure?", a: "Swaps incur a 0.05% protocol fee, which is distributed to NEX stakers. There are no hidden fees." },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-lg hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 container mx-auto px-4">
        <div className="bg-gradient-to-r from-secondary/50 to-background border border-primary/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our support team is available 24/7 to help you with any issues or inquiries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="font-bold gap-2">
                <Mail className="w-4 h-4" /> Contact Support
              </Button>
              <Button size="lg" variant="outline" className="font-bold gap-2">
                <Github className="w-4 h-4" /> View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
