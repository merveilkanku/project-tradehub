"use client"

import { Search, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/hooks/use-auth"
import { NotificationCenter } from "@/components/notifications/notification-center"

interface AppHeaderProps {
  onSearchClick: () => void
  showSearch?: boolean
}

export function AppHeader({ onSearchClick, showSearch = true }: AppHeaderProps) {
  const { user, signOut } = useAuth()

  const getUserInitials = (fullName: string | null | undefined) => {
    if (!fullName) return "U"
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-instagram-gradient bg-instagram-gradient bg-clip-text text-transparent">
            TradHub
          </h1>
          {user && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-instagram-gradient rounded-full animate-pulse"></div>
                {user.profile?.city || "Ville"}, {user.profile?.country || "Pays"}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="text-muted-foreground hover:text-foreground hover:bg-instagram-gradient/10 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {user && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-instagram-gradient/10 rounded-full transition-all duration-300 hover:scale-110 relative"
                  >
                    <Bell className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-instagram-gradient rounded-full animate-pulse shadow-lg"></div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0 border-0 shadow-2xl">
                  <NotificationCenter />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-instagram-gradient/10 transition-all duration-300"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-instagram-gradient/20">
                      <AvatarImage src={user.profile?.avatar_url || ""} alt={user.profile?.full_name || "User"} />
                      <AvatarFallback className="bg-instagram-gradient text-white text-sm font-semibold">
                        {getUserInitials(user.profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {user.profile?.full_name || "Utilisateur"}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.profile?.user_type || "simple"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.profile?.full_name || "Utilisateur"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      // Navigate to menu page and then to profile view
                      const event = new CustomEvent("navigate-to-profile")
                      window.dispatchEvent(event)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      // Navigate to menu page and then to settings view
                      const event = new CustomEvent("navigate-to-settings")
                      window.dispatchEvent(event)
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
