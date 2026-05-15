"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, Camera, Sparkles, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  badge?: string
}

function SidebarItem({ icon, label, href, badge }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#FDF2F8] text-[#F9A8C9]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <Badge className="ml-auto border-0 bg-[#C4B5FD] text-[10px] font-medium text-white">
          {badge}
        </Badge>
      )}
    </Link>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/50 lg:bg-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          project
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
        <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" href="/" />
        <SidebarItem icon={<History className="h-5 w-5" />} label="History" href="/history" />
        <SidebarItem icon={<Sparkles className="h-5 w-5" />} label="Style" href="/style" badge="Beta" />
        <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" href="/profile" />
        <SidebarItem icon={<Settings className="h-5 w-5" />} label="Settings" href="/settings" />

        <div className="mt-auto">
          <Link href="/upload">
            <Button className="w-full rounded-xl bg-[#F9A8C9] py-6 text-sm font-semibold text-white shadow-lg shadow-[#F9A8C9]/30 transition-all hover:bg-[#F490B8]">
              <Camera className="mr-2 h-5 w-5" />
              Start Analysis
            </Button>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
