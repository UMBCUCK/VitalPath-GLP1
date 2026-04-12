export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 rounded-lg bg-navy-100/50" />
          <div className="mt-2 h-4 w-64 rounded bg-navy-50" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-navy-50" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-navy-100/40 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-navy-50" />
              <div className="h-8 w-8 rounded-lg bg-navy-50" />
            </div>
            <div className="mt-3 h-8 w-28 rounded-lg bg-navy-100/50" />
            <div className="mt-2 h-3 w-36 rounded bg-navy-50" />
          </div>
        ))}
      </div>

      {/* Chart + sidebar skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-navy-100/40 bg-white p-6">
          <div className="h-5 w-32 rounded bg-navy-50 mb-4" />
          <div className="h-64 rounded-xl bg-navy-50/60" />
        </div>
        <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
          <div className="h-5 w-24 rounded bg-navy-50 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-navy-50" />
                <div className="flex-1">
                  <div className="h-3.5 w-full rounded bg-navy-50" />
                  <div className="mt-1.5 h-3 w-2/3 rounded bg-navy-50/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 rounded bg-navy-50" />
          <div className="h-8 w-24 rounded-lg bg-navy-50" />
        </div>
        <div className="space-y-3">
          {/* Table header */}
          <div className="flex gap-4 border-b border-navy-100/30 pb-3">
            <div className="h-3 w-1/4 rounded bg-navy-50" />
            <div className="h-3 w-1/6 rounded bg-navy-50" />
            <div className="h-3 w-1/6 rounded bg-navy-50" />
            <div className="h-3 w-1/6 rounded bg-navy-50" />
            <div className="h-3 w-1/6 rounded bg-navy-50" />
          </div>
          {/* Table rows */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="h-4 w-1/4 rounded bg-navy-50/60" />
              <div className="h-4 w-1/6 rounded bg-navy-50/60" />
              <div className="h-4 w-1/6 rounded bg-navy-50/60" />
              <div className="h-4 w-1/6 rounded bg-navy-50/60" />
              <div className="h-4 w-1/6 rounded bg-navy-50/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
