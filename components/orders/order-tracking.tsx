"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle, Star, ArrowLeft } from "lucide-react"

interface OrderTrackingProps {
  orderId: string
  onBack: () => void
}

interface TrackingStep {
  id: string
  title: string
  description: string
  timestamp: string
  status: "completed" | "current" | "pending"
  location?: string
}

const mockTrackingSteps: TrackingStep[] = [
  {
    id: "1",
    title: "Commande confirmée",
    description: "Votre commande a été confirmée et est en cours de préparation",
    timestamp: "2024-01-15T10:00:00Z",
    status: "completed",
    location: "Kinshasa, RDC",
  },
  {
    id: "2",
    title: "Préparation en cours",
    description: "Le vendeur prépare votre commande",
    timestamp: "2024-01-15T14:30:00Z",
    status: "completed",
    location: "Kinshasa, RDC",
  },
  {
    id: "3",
    title: "Expédié",
    description: "Votre commande a été expédiée",
    timestamp: "2024-01-16T09:15:00Z",
    status: "current",
    location: "Centre de tri Kinshasa",
  },
  {
    id: "4",
    title: "En transit",
    description: "Votre commande est en route vers sa destination",
    timestamp: "",
    status: "pending",
    location: "En route vers Lubumbashi",
  },
  {
    id: "5",
    title: "Livré",
    description: "Votre commande a été livrée",
    timestamp: "",
    status: "pending",
    location: "Lubumbashi, RDC",
  },
]

const mockOrder = {
  id: "ORD-12345",
  status: "shipped",
  total: 45000,
  currency: "CDF",
  estimatedDelivery: "2024-01-18",
  trackingNumber: "TRK-789456123",
  supplier: {
    name: "Marie Kabongo",
    phone: "+243 123 456 789",
    avatar: "/avatar-marie.png",
    rating: 4.8,
  },
  shippingAddress: "123 Avenue Lumumba, Lubumbashi, RDC",
  items: [
    {
      id: "1",
      title: "Robe Africaine Traditionnelle",
      image: "/african-wax-robe.png",
      quantity: 1,
      price: 45000,
    },
  ],
}

export function OrderTracking({ orderId, onBack }: OrderTrackingProps) {
  const [trackingSteps] = useState<TrackingStep[]>(mockTrackingSteps)

  const getStepIcon = (status: string, stepType: string) => {
    if (status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (status === "current") {
      return <Clock className="h-5 w-5 text-instagram-gradient animate-pulse" />
    }

    switch (stepType) {
      case "shipped":
        return <Truck className="h-5 w-5 text-muted-foreground" />
      case "delivered":
        return <Package className="h-5 w-5 text-muted-foreground" />
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentStep = trackingSteps.find((step) => step.status === "current")
  const completedSteps = trackingSteps.filter((step) => step.status === "completed").length

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-instagram-gradient">Suivi de commande</h1>
          <p className="text-muted-foreground">#{mockOrder.id}</p>
        </div>
      </div>

      {/* Order Status Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">État de la commande</h3>
              <p className="text-sm text-muted-foreground">
                Étape {completedSteps + 1} sur {trackingSteps.length}
              </p>
            </div>
            <Badge
              className={`${
                mockOrder.status === "delivered"
                  ? "bg-green-500"
                  : mockOrder.status === "shipped"
                    ? "bg-instagram-gradient"
                    : "bg-yellow-500"
              } text-white`}
            >
              {currentStep?.title || "En cours"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{Math.round(((completedSteps + 0.5) / trackingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-instagram-gradient h-2 rounded-full transition-all duration-500"
                style={{ width: `${((completedSteps + 0.5) / trackingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {mockOrder.estimatedDelivery && (
            <div className="mt-4 p-3 bg-instagram-gradient/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-instagram-gradient" />
                <span className="text-sm font-medium">
                  Livraison estimée : {new Date(mockOrder.estimatedDelivery).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-instagram-gradient" />
            Historique de livraison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStepIcon(step.status, step.id)}
                {index < trackingSteps.length - 1 && (
                  <div
                    className={`w-px h-12 mt-2 ${
                      step.status === "completed" ? "bg-green-500" : "bg-muted"
                    } transition-colors duration-300`}
                  ></div>
                )}
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-medium ${
                      step.status === "completed"
                        ? "text-foreground"
                        : step.status === "current"
                          ? "text-instagram-gradient"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground">{formatDate(step.timestamp)}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                {step.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {step.location}
                  </div>
                )}

                {step.status === "current" && (
                  <div className="mt-2 p-2 bg-instagram-gradient/10 rounded border border-instagram-gradient/20">
                    <p className="text-xs text-instagram-gradient font-medium">Étape en cours</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  {item.price} {mockOrder.currency}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Supplier Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={mockOrder.supplier.avatar || "/placeholder.svg"}
                alt={mockOrder.supplier.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-sm">{mockOrder.supplier.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">{mockOrder.supplier.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent hover:bg-instagram-gradient/10">
                <Phone className="h-4 w-4 mr-1" />
                Appeler
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent hover:bg-instagram-gradient/10">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h4 className="font-medium text-sm mb-2">Adresse de livraison</h4>
            <p className="text-sm text-muted-foreground">{mockOrder.shippingAddress}</p>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold text-instagram-gradient">
              {mockOrder.total} {mockOrder.currency}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
