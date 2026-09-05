export function SkeletonCard() {
  return (
    <div className="bg-white border border-line rounded-card p-5 animate-pulse">
      <div className="h-4 bg-line rounded w-1/3 mb-3"></div>
      <div className="h-3 bg-line rounded w-1/2 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-line rounded-full w-16"></div>
        <div className="h-6 bg-line rounded-full w-20"></div>
        <div className="h-6 bg-line rounded-full w-14"></div>
      </div>
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="bg-white border border-line rounded-card p-4 animate-pulse">
      <div className="aspect-square bg-line rounded-lg mb-3"></div>
      <div className="h-3 bg-line rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-line rounded w-1/2"></div>
    </div>
  );
}
