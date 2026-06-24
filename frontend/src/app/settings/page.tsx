"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  LogOut,
  Trash2,
  ChevronRight,
  Shield,
  Info,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { useAuth } from "@/hooks/useAuth"
import { deleteAccount } from "@/lib/api"

function SettingRow({
  icon,
  label,
  sublabel,
  onClick,
  danger = false,
  showArrow = true,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  onClick?: () => void
  danger?: boolean
  showArrow?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50 ${danger ? "text-destructive" : "text-foreground"}`}
    >
      <span className={`shrink-0 ${danger ? "text-destructive" : "text-muted-foreground"}`}>
        {icon}
      </span>
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      {showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      router.replace("/")
    } catch {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-24">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6 max-w-lg">

          {/* Account */}
          <section>
            <SectionLabel>Account</SectionLabel>
            <Card className="overflow-hidden border-border/50 shadow-sm p-0">
              {user ? (
                <>
                  {/* Profile summary */}
                  <div className="flex items-center gap-4 px-4 py-4 border-b border-border/50">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F8] shrink-0">
                        <User className="h-6 w-6 text-[#F9A8C9]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <SettingRow
                    icon={<LogOut className="h-4 w-4" />}
                    label="Logout"
                    onClick={handleLogout}
                    showArrow={false}
                  />
                </>
              ) : (
                !loading && (
                  <SettingRow
                    icon={<User className="h-4 w-4" />}
                    label="Sign In"
                    sublabel="Sign in to save your analysis and history"
                    onClick={() => {
                      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`
                    }}
                  />
                )
              )}
            </Card>
          </section>

          {/* Data & Privacy */}
          {user && (
            <section>
              <SectionLabel>Data &amp; Privacy</SectionLabel>
              <Card className="overflow-hidden border-border/50 shadow-sm p-0">
                <SettingRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Analysis History"
                  sublabel="View and manage your saved analyses"
                  onClick={() => router.push("/history")}
                />
                <div className="border-t border-border/50" />
                <SettingRow
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete Account"
                  sublabel="Permanently remove your account and all data"
                  onClick={() => setShowDeleteDialog(true)}
                  danger
                  showArrow={false}
                />
              </Card>
            </section>
          )}

          {/* About */}
          <section>
            <SectionLabel>About</SectionLabel>
            <Card className="overflow-hidden border-border/50 shadow-sm p-0">
              <CardContent className="px-4 py-3.5 flex items-center gap-4">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">face</p>
                  <p className="text-xs text-muted-foreground">AI skin analysis &amp; style studio</p>
                </div>
              </CardContent>
            </Card>
          </section>

        </main>
      </div>

      <BottomNav />

      {/* Delete account confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-7 w-7 text-destructive" />
            </div>
            <DialogTitle>Delete account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all analysis history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Button
              variant="destructive"
              className="w-full rounded-full py-6"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-full py-6 text-muted-foreground"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
