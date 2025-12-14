import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Wallet, PieChart } from "lucide-react";
import { LoadingSkeleton } from "@/components/defi/loading-skeleton";

const data = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
  { name: "Mon", value: 4200 },
];

export function PortfolioChart() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-border h-full">
        <LoadingSkeleton />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-md border-border h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Net Worth</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-mono font-bold">$12,450.32</span>
            <span className="text-primary text-sm font-bold flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-8 text-xs bg-secondary/50 border-transparent hover:bg-secondary">1D</Button>
           <Button variant="outline" size="sm" className="h-8 text-xs bg-primary/20 text-primary border-primary/20">1W</Button>
           <Button variant="outline" size="sm" className="h-8 text-xs bg-secondary/50 border-transparent hover:bg-secondary">1M</Button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
        {[
            { label: "Claimable", val: "$420.00", icon: Wallet },
            { label: "Staked", val: "$8,200.00", icon: PieChart },
            { label: "APR", val: "14.2%", icon: TrendingUp },
        ].map((stat, i) => (
            <div key={i}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <stat.icon className="w-3 h-3" />
                    {stat.label}
                </div>
                <div className="font-mono font-bold">{stat.val}</div>
            </div>
        ))}
      </div>
    </Card>
  );
}
