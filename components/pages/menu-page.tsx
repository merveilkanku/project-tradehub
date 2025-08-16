"use client"

import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Package, Heart, Settings, LogOut, CreditCard, MapPin, Phone, Mail, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProductManagement } from "@/components/products/product-management"
import { EditProfile } from "@/components/profile/edit-profile"
import { UserProfile } from "@/components/profile/user-profile"
import { SettingsPage } from "@/components/settings/settings-page"
import { UserOrders } from "@/components/profile/user-orders"
import { UserFavorites } from "@/components/profile/user-favorites"

export function MenuPage() {
  const { user, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<
    "menu" | "products" | "profile" | "edit-profile" | "settings" | "orders" | "favorites"
  >("menu")

  if (!user?.profile) return null

  if (currentView === "products") {
    return <ProductManagement onBack={() => setCurrentView("menu")} />
  }

  if (currentView === "profile") {
    return <UserProfile onEdit={() => setCurrentView("edit-profile")} />
  }

  if (currentView === "edit-profile") {
    return <EditProfile onBack={() => setCurrentView("profile")} />
  }

  if (currentView === "settings") {
    return <SettingsPage onBack={() => setCurrentView("menu")} />
  }

  if (currentView === "orders") {
    return <UserOrders onBack={() => setCurrentView("menu")} />
  }

  if (currentView === "favorites") {
    return <UserFavorites onBack={() => setCurrentView("menu")} />
  }

  const getUserInitials = (fullName: string | null | undefined) => {
    if (!fullName) return "U"
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    { icon: Eye, label: "Voir mon profil", action: () => setCurrentView("profile") },
    { icon: User, label: "Modifier le profil", action: () => setCurrentView("edit-profile") },
    { icon: Package, label: "Mes commandes", action: () => setCurrentView("orders") },
    { icon: Heart, label: "Mes favoris", action: () => setCurrentView("favorites") },
    { icon: Settings, label: "Paramètres", action: () => setCurrentView("settings") },
  ]

  if (user.profile.user_type === "supplier") {
    menuItems.splice(2, 0, {
      icon: Package,
      label: "Gérer mes produits",
      action: () => setCurrentView("products"),
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-instagram-gradient/20">
              <AvatarImage src={user.profile.avatar_url || undefined} />
              <AvatarFallback className="text-lg bg-instagram-gradient text-white">
                {getUserInitials(user.profile.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-instagram-gradient">{user.profile.full_name || "Utilisateur"}</h2>
                {user.profile.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    Vérifié
                  </Badge>
                )}
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email || "Email non défini"}
                </div>
                {user.profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {user.profile.phone}
                  </div>
                )}
                {user.profile.city && user.profile.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {user.profile.city}, {user.profile.country}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={user.profile.user_type === "supplier" ? "default" : "secondary"}
                  className={`text-xs ${user.profile.user_type === "supplier" ? "bg-instagram-gradient" : ""}`}
                >
                  {user.profile.user_type === "supplier" ? "Fournisseur" : "Utilisateur"}
                </Badge>

                {user.profile.user_type === "supplier" && (
                  <Badge
                    variant={user.profile.payment_status === "paid" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {user.profile.payment_status === "paid" ? "Payé" : "En attente"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {user.profile.bio && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Card
              key={index}
              className="hover:shadow-md transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-instagram-gradient/5"
            >
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-0 hover:bg-transparent"
                  onClick={item.action}
                >
                  <Icon className="h-5 w-5 mr-3 text-instagram-gradient" />
                  <span className="text-left font-medium">{item.label}</span>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment Status for Suppliers */}
      {user.profile.user_type === "supplier" && user.profile.payment_status !== "paid" && (
        <Card className="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <h3 className="font-medium text-destructive">Paiement en attente</h3>
                <p className="text-sm text-muted-foreground">
                  Votre compte fournisseur sera activé après vérification du paiement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Card className="border-destructive/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
