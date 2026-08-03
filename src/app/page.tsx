import { LandingHero } from '@/components/LandingHero'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <LandingHero isLoggedIn={true} />
    </main>
  )
}


