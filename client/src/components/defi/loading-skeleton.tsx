import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="w-full h-full p-6 space-y-4">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
