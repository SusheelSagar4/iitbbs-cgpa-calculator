export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cyan Ambient Orb */}
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-600/15 blur-[140px] animate-float-slow" />
        {/* Violet Ambient Orb */}
        <div className="absolute top-1/3 -right-40 h-[650px] w-[650px] rounded-full bg-purple-600/15 blur-[160px] animate-float-reverse" />
        {/* Blue Center Glow */}
        <div className="absolute -bottom-40 left-1/3 h-[700px] w-[700px] rounded-full bg-blue-600/10 blur-[180px] animate-pulse-glow" />
        {/* Fine Grain Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Sticky Glass Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Brand Glass Icon */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 text-sm font-black text-cyan-300 shadow-lg shadow-cyan-500/10">
              <span className="relative z-10">CG</span>
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                IIT Bhubaneswar <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Academic Tracker</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Offline Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
