"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, Calendar, MapPin, Eye, MessageCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface UserOrdersProps {
  onBack: () => void
}

interface Order {
  id: string
  total_amount: number
  currency: string
  status: string
  created_at: string
  shipping_address: string
  products: {
    id: string
    title: string
    images: string[]
    quantity: number
    price: number
  }[]
}

export function UserOrders({ onBack }: UserOrdersProps) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (id, title, images)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedOrders =
        data?.map((order) => ({
          ...order,
          products:
            order.order_items?.map((item: any) => ({
              ...item.products,
              quantity: item.quantity,
              price: item.price,
            })) || [],
        })) || []

      setOrders(formattedOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "confirmed":
        return "Confirmée"
      case "shipped":
        return "Expédiée"
      case "delivered":
        return "Livrée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return order.status === "pending"
    if (activeTab === "completed") return ["delivered", "confirmed"].includes(order.status)
    if (activeTab === "cancelled") return order.status === "cancelled"
    return true
  })

  const getOrderStats = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => ["delivered", "confirmed"].includes(o.status)).length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }
  }

  const stats = getOrderStats()

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-instagram-gradient">Mes commandes</h1>
        <Button variant="ghost" size="sm" onClick={loadOrders} className="ml-auto hover:bg-instagram-gradient/10">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-instagram-gradient">{stats.all}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Terminées</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">Annulées</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({stats.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-8 text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="space-y-3">
                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium">Aucune commande</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "all"
                      ? "Vous n'avez pas encore passé de commande"
                      : `Aucune commande ${activeTab === "pending" ? "en attente" : activeTab === "completed" ? "terminée" : "annulée"}`}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Commande #{order.id.slice(0, 8)}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(order.status)} className="text-sm px-3 py-1">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {order.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                          <img
                            src={product.images[0] || `/placeholder.svg?height=60&width=60&query=product`}
                            alt={product.title}
                            className="w-15 h-15 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium line-clamp-1">{product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantité: {product.quantity} × {product.price} {order.currency}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {(product.quantity * product.price).toFixed(2)} {order.currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{order.shipping_address}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-instagram-gradient">
                          {order.total_amount} {order.currency}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-instagram-gradient/10 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-instagram-gradient/10 bg-transparent"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
