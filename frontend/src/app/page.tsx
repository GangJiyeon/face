import { Header } from "@/components/header"
import { SkinSummaryCard } from "@/components/skin-summary-card"
import { StartAnalysisButton } from "@/components/start-analysis-button"
import { RecommendedProducts } from "@/components/recommended-products"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-hidden">
        <div className="w-full lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8">
          {/* Mobile Header - hidden on desktop */}
          <div className="lg:hidden">
            <Header />
          </div>

          {/* Left Column on Desktop */}
          <div className="lg:space-y-6">
            {/* Desktop Header */}
            <div className="hidden lg:mb-6 lg:block">
              <h2 className="text-2xl font-bold text-foreground">
                Good Morning!
              </h2>
              <p className="mt-1 text-muted-foreground">
                {"Here's your skin analysis summary for today."}
              </p>
            </div>

            <SkinSummaryCard />
            
            {/* Mobile only: Start Analysis Button */}
            <div className="lg:hidden">
              <StartAnalysisButton />
            </div>
          </div>

          {/* Right Column on Desktop */}
          <div className="lg:space-y-6">
            {/* Desktop Quick Stats */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-border/50 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Weekly Progress
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                    <p className="text-sm text-muted-foreground">Analyses</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">12</p>
                  </div>
                  <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">78</p>
                  </div>
                  <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">5 days</p>
                  </div>
                  <div className="rounded-xl bg-linear-to-br from-[#FDF2F8] to-[#F3E8FF] p-4">
                    <p className="text-sm text-muted-foreground">Improvement</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">+8%</p>
                  </div>
                </div>
              </div>
            </div>

            <RecommendedProducts />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
