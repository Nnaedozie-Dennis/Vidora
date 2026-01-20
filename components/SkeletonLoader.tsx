
export default function SkeletonLoader() {
  return (
    <div className="w-full h-64 bg-slate-700 rounded-lg animate-pulse">
      <div className="h-4/5 bg-slate-600"></div>
      <div className="p-2 space-y-2">
        <div className="h-4 bg-slate-600"></div>
        <div className="h-3 bg-slate-600 w-1/2"></div>
      </div>
    </div>
  );
}