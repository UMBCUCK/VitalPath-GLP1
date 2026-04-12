export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-100/60 to-navy-100/40 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-3.5 w-36 rounded bg-navy-200/30" />
            <div className="mt-2.5 h-7 w-56 rounded-lg bg-navy-200/40" />
            <div className="mt-3 h-3.5 w-72 rounded bg-navy-200/20" />
          </div>
          <div className="h-6 w-20 rounded-full bg-navy-200/30" />
        </div>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <div className="h-3 w-20 rounded bg-navy-200/20" />
            <div className="h-3 w-16 rounded bg-navy-200/20" />
          </div>
          <div className="h-2 w-full rounded-full bg-navy-200/20" />
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100/40 bg-white p-4">
            <div className="h-10 w-10 rounded-xl bg-navy-50" />
            <div className="h-3 w-16 rounded bg-navy-50" />
          </div>
        ))}
      </div>

      {/* Health numbers skeleton */}
      <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 rounded bg-navy-50" />
          <div className="h-7 w-16 rounded bg-navy-50" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-navy-50/60 p-3 text-center">
              <div className="mx-auto h-4 w-4 rounded bg-navy-100/40 mb-1" />
              <div className="mx-auto h-6 w-12 rounded bg-navy-100/50 mt-1" />
              <div className="mx-auto h-2.5 w-10 rounded bg-navy-50 mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Tracking + notifications skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-navy-100/40 bg-white p-6">
          <div className="h-5 w-32 rounded bg-navy-50 mb-4" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-navy-50/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-4 rounded bg-navy-100/40" />
                  <div className="h-3 w-12 rounded bg-navy-100/30" />
                </div>
                <div className="h-8 w-16 rounded bg-navy-100/40" />
                <div className="mt-1.5 h-3 w-20 rounded bg-navy-50" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-navy-100/40 bg-white p-6">
          <div className="h-5 w-20 rounded bg-navy-50 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-navy-50/40 p-3">
                <div className="h-4 w-4 rounded bg-navy-100/40 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 w-full rounded bg-navy-100/30" />
                  <div className="mt-1.5 h-3 w-2/3 rounded bg-navy-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
