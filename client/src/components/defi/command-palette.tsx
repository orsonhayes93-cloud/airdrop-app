import { useEffect, useState } from "react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator, 
  CommandShortcut 
} from "@/components/ui/command";
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User, 
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => toast.info("Opening Swap..."))}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Swap Tokens</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => toast.info("Opening Stake..."))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Stake Assets</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => toast.info("Connecting Wallet..."))}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Connect Wallet</span>
            <CommandShortcut>⌘W</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => window.location.href = '#portfolio')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>View Portfolio</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.location.href = '#settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
