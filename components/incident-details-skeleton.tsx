"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function IncidentDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Handlers */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}