/**
 * Skeleton Component - Loading placeholder
 */

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 rounded',
        className
      )}
    />
  );
}

// Pre-built skeleton patterns
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-100 p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-7 w-24 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      <div className="bg-white rounded-lg border border-slate-100 p-4 shadow space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        
        <Skeleton className="h-16 w-full" />
      </div>
      
      <div className="bg-white rounded-lg border border-slate-100 p-4 shadow space-y-3">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export function InventoryListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
