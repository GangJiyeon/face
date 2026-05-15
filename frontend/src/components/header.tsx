"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        project
      </h1>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  )
}
