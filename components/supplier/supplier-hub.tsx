"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, Eye, MessageCircle, Star, BarChart3, DollarSign, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProductManagement } from "@/components/products/product-management"

interface SupplierHubProps {
  onBack?: () => void
}

export function SupplierHub({ onBack }: SupplierHubProps) {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<"hub" | "products" | "add-product">("hub")

  if (currentView === "products") {
    return <ProductManagement onBack={() => setCurrentView("hub")} />
  }

  if (!user?.profile || user.profile.user_type !== "supplier") {
    return (
      <div className="p-4">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">Accès refusé</h3>
            <p className="text-muted-foreground">Cette section est réservée aux fournisseurs.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    { label: "Produits actifs", value: "12", icon: Package, color: "text-blue-500" },
    { label: "Vues ce mois", value: "1,234", icon: Eye, color: "text-green-500" },
    { label: "Messages", value: "8", icon: MessageCircle, color: "text-purple-500" },
    { label: "Note moyenne", value: "4.8", icon: Star, color: "text-yellow-500" },
  ]

  const quickActions = [
    {
      title: "Ajouter un produit",
      description: "Publier une nouvelle annonce",
      icon: Plus,
      action: () => setCurrentView("add-product"),
      color: "bg-instagram-gradient",
    },
    {
      title: "Gérer mes produits",
      description: "Modifier, supprimer ou désactiver",
      icon: Package,
      action: () => setCurrentView("products"),
      color: "bg-blue-500",
    },
    {
      title: "Voir les statistiques",
      description: "Analyser les performances",
      icon: BarChart3,
      action: () => {},
      color: "bg-green-500",
    },
    {
      title: "Messages clients",
      description: "Répondre aux demandes",
      icon: MessageCircle,
      action: () => {},
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-instagram-gradient">Mon Business</h1>
        <p className="text-muted-foreground">Gérez votre activité de fournisseur</p>
      </div>

      {/* Payment Status */}
      {user.profile.payment_status !== "paid" && (
        <Card className="border-orange-500/50 bg-orange-500/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-500">Compte en attente d'activation</h3>
                <p className="text-sm text-muted-foreground">Votre paiement de 5$ USD est en cours de vérification</p>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Actions rapides</h3>
        <div className="grid gap-3">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-instagram-gradient/5 hover:border-instagram-gradient/30 transition-all duration-300 cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-instagram-gradient transition-colors duration-300">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-instagram-gradient" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { action: "Nouveau message de Marie K.", time: "Il y a 2h", type: "message" },
            { action: "Produit 'Smartphone Samsung' vu 15 fois", time: "Il y a 4h", type: "view" },
            { action: "Commande #1234 confirmée", time: "Hier", type: "order" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-instagram-gradient"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
