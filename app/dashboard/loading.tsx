export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="rounded-2xl bg-navy-100/50 h-48" />

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-navy-50" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-64 rounded-2xl bg-navy-50" />
        <div className="h-64 rounded-2xl bg-navy-50" />
      </div>
    </div>
  );
}
