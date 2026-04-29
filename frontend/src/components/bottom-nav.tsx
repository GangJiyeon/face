"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, Camera, Sparkles, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  badge?: string
}

function NavItem({ icon, label, href, badge }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        isActive ? "text-[#F9A8C9]" : "text-muted-foreground"
      )}
    >
      <span className="relative">
        {icon}
        {badge && (
          <Badge className="absolute -top-1 -right-3 h-4 border-0 bg-[#C4B5FD] px-1 text-[10px] font-medium text-white">
            {badge}
          </Badge>
        )}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-white/80 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-6 pt-2">
        <NavItem icon={<Home className="h-5 w-5" />} label="Home" href="/" />
        <NavItem icon={<History className="h-5 w-5" />} label="History" href="/history"/>
        
        {/* Center Camera Button */}
        <Link href="/upload">
          <button className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#F9A8C9] shadow-lg shadow-[#F9A8C9]/40 transition-transform hover:scale-105 active:scale-95">
            <Camera className="h-6 w-6 text-white" />
            <span className="sr-only">Take Photo</span>
          </button>
        </Link>
        
        <NavItem
          icon={<Sparkles className="h-5 w-5" />}
          label="Style"
          href="/style"
          badge="Beta"
        />
        <NavItem icon={<User className="h-5 w-5" />} label="Profile" href="/profile"/>
      </div>
    </nav>
  )
}
