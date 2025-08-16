"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Phone, Mail, Send, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ContactSupplierModalProps {
  isOpen: boolean
  onClose: () => void
  supplier: {
    id: string
    full_name: string
    avatar_url?: string | null
    city?: string
    country?: string
  }
  product?: {
    id: string
    title: string
    price: number
    currency: string
  }
}

export function ContactSupplierModal({ isOpen, onClose, supplier, product }: ContactSupplierModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState(product ? `Intéressé par: ${product.title}` : "")
  const [loading, setLoading] = useState(false)

  if (!supplier) {
    return null
  }

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return

    setLoading(true)
    try {
      // Simulate sending message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically create a conversation and send the message
      console.log("[v0] Sending message to supplier:", {
        supplierId: supplier.id,
        subject,
        message,
        productId: product?.id,
      })

      onClose()
      setMessage("")
      setSubject("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-instagram-gradient">
            <MessageCircle className="h-5 w-5" />
            Contacter le fournisseur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Info */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-full bg-instagram-gradient/20 flex items-center justify-center">
              {supplier.avatar_url ? (
                <img
                  src={supplier.avatar_url || "/placeholder.svg"}
                  alt={supplier.full_name || "Fournisseur"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-instagram-gradient" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{supplier.full_name || "Fournisseur"}</h3>
              {supplier.city && supplier.country && (
                <p className="text-sm text-muted-foreground">
                  {supplier.city}, {supplier.country}
                </p>
              )}
            </div>
          </div>

          {/* Product Info */}
          {product && (
            <div className="p-4 rounded-lg bg-instagram-gradient/5 border border-instagram-gradient/20">
              <h4 className="font-medium text-instagram-gradient mb-1">Produit concerné</h4>
              <p className="text-sm">{product.title}</p>
              <p className="text-sm font-semibold">
                {product.price} {product.currency}
              </p>
            </div>
          )}

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sujet de votre message"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, je suis intéressé par votre produit..."
                rows={4}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-instagram-gradient/10 hover:border-instagram-gradient/30 bg-transparent"
              onClick={() => setMessage("Bonjour, pouvez-vous me donner plus d'informations sur ce produit ?")}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Plus d'infos</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-instagram-gradient/10 hover:border-instagram-gradient/30 bg-transparent"
              onClick={() => setMessage("Bonjour, quel est votre meilleur prix pour ce produit ?")}
            >
              <Phone className="h-4 w-4" />
              <span className="text-xs">Négocier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-instagram-gradient/10 hover:border-instagram-gradient/30 bg-transparent"
              onClick={() => setMessage("Bonjour, ce produit est-il toujours disponible ?")}
            >
              <Mail className="h-4 w-4" />
              <span className="text-xs">Disponibilité</span>
            </Button>
          </div>

          {/* Send Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annuler
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              className="flex-1 bg-instagram-gradient hover:bg-instagram-gradient/90 text-white"
            >
              {loading ? (
                "Envoi..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
