"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Package } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ChatService, type Conversation } from "@/lib/chat-service"

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return

    try {
      const data = await ChatService.getConversations(user.id)
      setConversations(data)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participant1.id === user?.id ? conversation.participant2 : conversation.participant1
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("fr-FR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-3">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium">Aucune conversation</h3>
            <p className="text-sm text-muted-foreground">
              Contactez des fournisseurs depuis la page produits pour commencer une discussion
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation)
        const isSelected = selectedConversationId === conversation.id

        return (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "ring-2 ring-primary" : ""}`}
            onClick={() => onSelectConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherParticipant.avatar_url || undefined} />
                  <AvatarFallback>
                    {otherParticipant.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium truncate">{otherParticipant.full_name}</h4>
                    {conversation.last_message_at && (
                      <span className="text-xs text-muted-foreground">{formatTime(conversation.last_message_at)}</span>
                    )}
                  </div>

                  {conversation.product && (
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{conversation.product.title}</span>
                    </div>
                  )}

                  {conversation.last_message ? (
                    <p className="text-sm text-muted-foreground truncate">{conversation.last_message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Nouvelle conversation</p>
                  )}
                </div>

                {!conversation.last_message_at && (
                  <Badge variant="secondary" className="text-xs">
                    Nouveau
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
