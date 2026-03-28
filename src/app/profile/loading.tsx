export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-8 animate-pulse">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/10 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/5 rounded" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-xl" />
        ))}
      </div>
      {/* Order history */}
      <div className="space-y-4">
        <div className="h-5 w-32 bg-white/10 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
