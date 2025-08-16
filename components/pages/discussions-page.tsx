"use client"

import { useState } from "react"
import { ConversationList } from "@/components/chat/conversation-list"
import { ChatConversation } from "@/components/chat/chat-conversation"
import type { Conversation } from "@/lib/chat-service"

export function DiscussionsPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {selectedConversation ? (
        <ChatConversation conversation={selectedConversation} onBack={handleBackToList} />
      ) : (
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Discussions</h1>
            <p className="text-muted-foreground">Vos conversations avec les fournisseurs</p>
          </div>
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
      )}
    </div>
  )
}
