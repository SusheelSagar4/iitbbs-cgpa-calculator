import { ThemeProvider } from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-[#D9B061]/30 selection:text-[#3F0D0C]">
        {/* Multi-Layered Glowing 3D Sunset Orbs Background (Reference Image 1) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Sunset Magenta/Pink Glowing Orb */}
          <div className="absolute -top-32 -left-32 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#D9B061]/20 via-[#D9C4A9]/10 to-[#3F0D0C]/25 blur-[130px] animate-orb-1 opacity-80" />

          {/* Sunset Orange/Gold Glowing Orb */}
          <div className="absolute top-1/4 -right-40 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-[#D9C4A9]/20 via-[#8D6F57]/15 to-[#3F0D0C]/20 blur-[150px] animate-orb-2 opacity-75" />

          {/* Deep Cyan/Violet Center Orb */}
          <div className="absolute -bottom-40 left-1/4 h-[750px] w-[750px] rounded-full bg-gradient-to-br from-[#D9B061]/15 via-[#3F0D0C]/15 to-[#D9C4A9]/25 blur-[170px] animate-orb-pulse opacity-70" />

          {/* VisionOS Subtle Geometric Concentric Rings (Reference Image 1) */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full border border-white/[0.04] pointer-events-none" />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.03] pointer-events-none" />

          {/* Soft Mesh Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        {/* Floating VisionOS Navigation Capsule (Reference Image 3) */}
        <div className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3.5">
                {/* 3D Glossy Sunset Brand Capsule */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border-t border-l border-white/50 bg-gradient-to-br from-[#D9B061] via-[#D9C4A9] to-[#8D6F57] text-sm font-black text-[#3F0D0C] shadow-lg shadow-[#D9B061]/30">
                  <span className="relative z-10">CG</span>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm" />
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight text-[var(--text-main)] sm:text-lg">
                    IIT Bhubaneswar <span className="bg-gradient-to-r from-[#D9B061] via-[#D9C4A9] to-[#8D6F57] bg-clip-text text-transparent">Academic Tracker</span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D9B061]/30 bg-[#D9B061]/10 px-3.5 py-1 text-xs font-bold text-[#D9B061] backdrop-blur-md shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#D9B061] animate-ping" />
                  VisionOS Spatial
                </span>

                {/* Sun / Moon Theme Toggle */}
                <ThemeToggle />
              </div>
            </div>
          </header>
        </div>

        {/* Main Content Area */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
