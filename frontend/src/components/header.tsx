"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="flex items-center justify-between px-5 py-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        project
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>
        {!loading && (
          <Link
            href={user ? "/profile" : `${process.env.NEXT_PUBLIC_API_URL}/auth/login`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {user ? user.name.split(" ")[0] : "login"}
          </Link>
        )}
      </div>
    </header>
  )
}
