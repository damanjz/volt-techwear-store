export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-white/10 rounded" />
        <div className="h-10 w-32 bg-white/10 rounded" />
      </div>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="h-12 bg-white/5 border-b border-white/10" />
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-white/5 flex items-center gap-4 px-4"
          >
            <div className="w-10 h-10 bg-white/5 rounded" />
            <div className="h-4 w-40 bg-white/5 rounded" />
            <div className="h-4 w-20 bg-white/5 rounded ml-auto" />
            <div className="h-4 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
