"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, Package, MessageCircle, Heart, Star, TrendingUp, X, Check, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Notification {
  id: string
  type: "message" | "order" | "like" | "review" | "promotion" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: {
    productId?: string
    orderId?: string
    userId?: string
    amount?: number
    currency?: string
  }
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Nouveau message",
    message: "Marie Kabongo vous a envoyé un message concernant la Robe Africaine",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    metadata: { userId: "user1", productId: "prod1" },
  },
  {
    id: "2",
    type: "order",
    title: "Commande confirmée",
    message: "Votre commande #12345 a été confirmée et sera expédiée sous 24h",
    timestamp: "2024-01-15T09:15:00Z",
    read: false,
    metadata: { orderId: "12345", amount: 45000, currency: "CDF" },
  },
  {
    id: "3",
    type: "like",
    title: "Produit liké",
    message: "Jean Mukendi a ajouté votre Smartphone Samsung à ses favoris",
    timestamp: "2024-01-15T08:45:00Z",
    read: true,
    metadata: { userId: "user2", productId: "prod2" },
  },
  {
    id: "4",
    type: "review",
    title: "Nouvel avis",
    message: "Vous avez reçu un avis 5 étoiles sur votre produit Ordinateur Portable HP",
    timestamp: "2024-01-14T16:20:00Z",
    read: true,
    metadata: { productId: "prod3" },
  },
  {
    id: "5",
    type: "promotion",
    title: "Offre spéciale",
    message: "Réduction de 20% sur tous les produits électroniques ce week-end !",
    timestamp: "2024-01-14T12:00:00Z",
    read: false,
  },
]

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "messages" | "orders">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "order":
        return <Package className="h-5 w-5 text-green-500" />
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "promotion":
        return <TrendingUp className="h-5 w-5 text-instagram-gradient" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "À l'instant"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return date.toLocaleDateString("fr-FR")
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.read
      case "messages":
        return notif.type === "message"
      case "orders":
        return notif.type === "order"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-instagram-gradient" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-instagram-gradient text-white text-xs px-2 py-1">{unreadCount}</Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs hover:bg-instagram-gradient/10"
            >
              <Check className="h-4 w-4 mr-1" />
              Tout lire
            </Button>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {[
            { key: "all", label: "Toutes" },
            { key: "unread", label: "Non lues" },
            { key: "messages", label: "Messages" },
            { key: "orders", label: "Commandes" },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
              className={`text-xs ${
                filter === filterOption.key ? "bg-instagram-gradient text-white" : "hover:bg-instagram-gradient/10"
              }`}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-instagram-gradient/5 transition-colors cursor-pointer group ${
                      !notification.read ? "bg-instagram-gradient/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-instagram-gradient rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {notification.metadata && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            {notification.metadata.amount && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {notification.metadata.amount} {notification.metadata.currency}
                              </Badge>
                            )}
                            {notification.metadata.orderId && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                #{notification.metadata.orderId}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
