
export default function SkeletonLoader() {
  return (
    <div className="w-full aspect-2/3 sm:aspect-3/4 bg-slate-700 rounded-lg animate-pulse">
      <div className="h-4/5 bg-slate-600"></div>
      <div className="p-2 sm:p-3 space-y-2">
        <div className="h-3 sm:h-4 bg-slate-600"></div>
        <div className="h-2 sm:h-3 bg-slate-600 w-1/2"></div>
      </div>
    </div>
  );
}