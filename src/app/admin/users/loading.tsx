export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-white/10 rounded" />
      <div className="border border-white/10 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="h-12 bg-white/5 border-b border-white/10" />
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-white/5 flex items-center gap-4 px-4"
          >
            <div className="w-8 h-8 bg-white/5 rounded-full" />
            <div className="h-4 w-36 bg-white/5 rounded" />
            <div className="h-4 w-48 bg-white/5 rounded" />
            <div className="h-4 w-16 bg-white/10 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
