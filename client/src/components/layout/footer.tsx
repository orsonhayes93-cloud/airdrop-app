import { motion } from "framer-motion";
import { 
  FileText, 
  Users, 
  Mail, 
  HelpCircle, 
  Coins, 
  ArrowRight, 
  ShieldCheck, 
  Twitter, 
  Github, 
  Share2
} from "lucide-react";

export function Footer() {
  const sections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about", icon: Users },
        { name: "Contact Us", href: "#contact", icon: Mail },
        { name: "Careers", href: "#careers", icon: ArrowRight },
        { name: "Blog", href: "#blog", icon: FileText },
      ]
    },
    {
      title: "Protocol",
      links: [
        { name: "Tokenomics", href: "#tokenomics", icon: Coins },
        { name: "Whitepaper", href: "#whitepaper", icon: FileText },
        { name: "Governance", href: "#governance", icon: Users },
        { name: "Audits", href: "#audits", icon: ShieldCheck },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "#faq", icon: HelpCircle },
        { name: "Help Center", href: "#help", icon: HelpCircle },
        { name: "Terms of Service", href: "#terms", icon: FileText },
        { name: "Privacy Policy", href: "#privacy", icon: FileText },
      ]
    }
  ];

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                <div className="w-4 h-4 bg-background transform rotate-45" />
              </div>
              <span className="font-display font-bold text-xl tracking-wider">NEXUS</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The next generation of decentralized trading. Built for precision, speed, and security. Join the revolution of financial freedom.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Share2].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-sm"
                    >
                      <link.icon className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 Nexus Protocol. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
