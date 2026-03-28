export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded" />
      <div className="h-4 w-32 bg-white/5 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-[4/5] bg-white/5 border border-white/10" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-white/5 rounded" />
              <div className="h-5 w-32 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
