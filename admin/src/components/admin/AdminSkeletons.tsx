import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <Skeleton className="h-6 w-16 rounded-lg" />
    </div>
    <Skeleton className="h-3 w-24 mb-2" />
    <Skeleton className="h-9 w-32" />
  </div>
);

export const ChartSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white p-8 rounded-2xl shadow-sm border border-stone-100 ${className}`}>
    <div className="flex justify-between items-center mb-8">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-28 rounded-full" />
    </div>
    <div className="h-64 flex items-end gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t-lg"
          style={{ height: `${30 + ((i * 13) % 70)}%` }}
        />
      ))}
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
    <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="divide-y divide-stone-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-8 py-5 flex items-center gap-6">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 ${c === 0 ? "w-20" : c === 1 ? "w-40" : "w-24"}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);
