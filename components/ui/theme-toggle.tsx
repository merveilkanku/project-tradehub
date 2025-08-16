"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 hover:bg-instagram-gradient/10 hover:text-instagram-gradient transition-all duration-300 group"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
          <span className="sr-only">Basculer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-border/50">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`cursor-pointer hover:bg-instagram-gradient/10 hover:text-instagram-gradient transition-all duration-300 ${
            theme === "light" ? "bg-instagram-gradient/10 text-instagram-gradient" : ""
          }`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`cursor-pointer hover:bg-instagram-gradient/10 hover:text-instagram-gradient transition-all duration-300 ${
            theme === "dark" ? "bg-instagram-gradient/10 text-instagram-gradient" : ""
          }`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`cursor-pointer hover:bg-instagram-gradient/10 hover:text-instagram-gradient transition-all duration-300 ${
            theme === "system" ? "bg-instagram-gradient/10 text-instagram-gradient" : ""
          }`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
