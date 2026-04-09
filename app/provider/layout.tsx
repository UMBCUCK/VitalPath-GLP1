import Link from "next/link";
import { Users, ClipboardCheck, MessageCircle, Pill, LayoutDashboard } from "lucide-react";

const providerNav = [
  { label: "Dashboard", href: "/provider", icon: LayoutDashboard },
  { label: "Patients", href: "/provider/patients", icon: Users },
  { label: "Intake Reviews", href: "/provider/intakes", icon: ClipboardCheck },
  { label: "Messages", href: "/provider/messages", icon: MessageCircle },
  { label: "Prescribing", href: "/provider/prescribing", icon: Pill },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-linen/30">
      <aside className="hidden w-64 shrink-0 border-r border-navy-100/40 bg-white lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-100/40 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-atlantic text-xs font-bold text-white">VP</div>
            <div>
              <p className="text-sm font-bold text-navy">VitalPath</p>
              <p className="text-[10px] text-graphite-400">Provider Portal</p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {providerNav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-graphite-500 transition-colors hover:bg-atlantic/5 hover:text-atlantic">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-navy-100/40 bg-white px-6">
          <div>
            <p className="text-sm text-graphite-400">Provider Portal</p>
            <p className="text-base font-bold text-navy">Dr. Sarah Chen</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-atlantic flex items-center justify-center text-xs font-bold text-white">SC</div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
