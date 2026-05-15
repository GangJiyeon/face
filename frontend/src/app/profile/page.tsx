"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`)
    }
  }, [user, loading, router])

  if (loading || !user) return null

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">profile</h1>
          </div>
        </header>

        <main className="px-4 py-8 space-y-6">
          {/* profile 카드 */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-white p-8 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FDF2F8]">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-[#F9A8C9]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          {/* logout 버튼 */}
          <Button
            variant="outline"
            className="w-full rounded-xl py-6 text-sm font-medium text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            logout
          </Button>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
