export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-8 animate-pulse">
      <div className="h-6 w-40 bg-white/10 rounded" />
      <div className="h-4 w-56 bg-white/5 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col border border-white/10">
            <div className="aspect-[4/5] bg-white/5" />
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-3 w-12 bg-white/10 rounded" />
              </div>
              <div className="h-5 w-40 bg-white/10 rounded" />
              <div className="h-3 w-full bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
