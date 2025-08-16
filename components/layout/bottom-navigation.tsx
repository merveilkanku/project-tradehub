"use client"

import { Home, Package, Users, MessageCircle, Menu, LogIn, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAuthClick: () => void
}

export function BottomNavigation({ activeTab, onTabChange, onAuthClick }: BottomNavigationProps) {
  const { user } = useAuth()

  const getNavItems = () => {
    const baseItems = [
      { id: "home", label: "Accueil", icon: Home },
      { id: "products", label: "Produits", icon: Package },
    ]

    if (user?.profile?.user_type === "supplier") {
      return [
        ...baseItems,
        { id: "supplier-hub", label: "Mon Business", icon: Plus },
        { id: "discussions", label: "Messages", icon: MessageCircle },
        { id: "menu", label: "Menu", icon: Menu },
      ]
    }

    return [
      ...baseItems,
      { id: "suppliers", label: "Fournisseurs", icon: Users },
      { id: "discussions", label: "Discussions", icon: MessageCircle },
      { id: "menu", label: "Menu", icon: Menu },
    ]
  }

  const navItems = getNavItems()

  if (!user) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50">
        <div className="flex items-center justify-center p-4">
          <Button
            onClick={onAuthClick}
            className="flex items-center gap-2 bg-instagram-gradient hover:opacity-90 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            <LogIn className="h-5 w-5" />
            Se connecter / S'inscrire
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 ${
                isActive
                  ? "text-white bg-instagram-gradient rounded-xl shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
