"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ChatService } from "@/lib/chat-service"

interface StartConversationModalProps {
  isOpen: boolean
  onClose: () => void
  supplier: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  product: {
    id: string
    title: string
    images: string[]
  }
  onConversationStarted: (conversationId: string) => void
}

export function StartConversationModal({
  isOpen,
  onClose,
  supplier,
  product,
  onConversationStarted,
}: StartConversationModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return

    setLoading(true)
    try {
      // Start conversation
      const conversation = await ChatService.startConversation(user.id, supplier.id, product.id)

      // Send initial message
      await ChatService.sendMessage(conversation.id, user.id, message.trim())

      onConversationStarted(conversation.id)
      onClose()
      setMessage("")
    } catch (error) {
      console.error("Error starting conversation:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Contacter le fournisseur
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Supplier Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar>
              <AvatarImage src={supplier.avatar_url || undefined} />
              <AvatarFallback>
                {supplier.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{supplier.full_name}</p>
              <p className="text-sm text-muted-foreground">Fournisseur</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <img
              src={product.images[0] || `/placeholder.svg?height=48&width=48&query=product`}
              alt={product.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-sm line-clamp-2">{product.title}</p>
              <p className="text-xs text-muted-foreground">Produit concerné</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Votre message</label>
            <Textarea
              placeholder="Bonjour, je suis intéressé par ce produit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim() || loading} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
