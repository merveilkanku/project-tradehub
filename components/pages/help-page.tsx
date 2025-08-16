"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, HelpCircle, Book, MessageCircle, Video, FileText, ChevronRight, Star } from "lucide-react"

interface HelpPageProps {
  onBack: () => void
}

export function HelpPage({ onBack }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const helpCategories = [
    {
      icon: Book,
      title: "Guide de démarrage",
      description: "Apprenez les bases de TradHub",
      articles: 12,
      color: "text-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Acheter sur TradHub",
      description: "Comment passer commande et payer",
      articles: 8,
      color: "text-green-500",
    },
    {
      icon: Video,
      title: "Vendre sur TradHub",
      description: "Créer et gérer vos annonces",
      articles: 15,
      color: "text-purple-500",
    },
    {
      icon: FileText,
      title: "Compte et sécurité",
      description: "Gérer votre profil et sécurité",
      articles: 6,
      color: "text-orange-500",
    },
  ]

  const popularArticles = [
    {
      title: "Comment créer un compte fournisseur ?",
      views: "2.5k vues",
      rating: 4.8,
    },
    {
      title: "Quels sont les modes de paiement acceptés ?",
      views: "1.8k vues",
      rating: 4.9,
    },
    {
      title: "Comment contacter un fournisseur ?",
      views: "1.2k vues",
      rating: 4.7,
    },
    {
      title: "Politique de retour et remboursement",
      views: "980 vues",
      rating: 4.6,
    },
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Parlez à notre équipe support",
      action: "Démarrer le chat",
      available: true,
    },
    {
      icon: Video,
      title: "Tutoriels vidéo",
      description: "Regardez nos guides vidéo",
      action: "Voir les vidéos",
      available: true,
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Guide complet de l'API",
      action: "Lire la doc",
      available: true,
    },
  ]

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-twitter-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-twitter-instagram-gradient">Centre d'aide</h1>
      </div>

      {/* Search */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:ring-twitter-instagram-gradient/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <action.icon className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
              <h3 className="font-semibold mb-2 text-twitter-instagram-gradient">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button
                size="sm"
                className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white"
                disabled={!action.available}
              >
                {action.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-twitter-instagram-gradient">Catégories d'aide</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {helpCategories.map((category) => (
            <Card
              key={category.title}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <category.icon
                    className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-twitter-instagram-gradient group-hover:text-twitter-instagram-gradient/80">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient"
                      >
                        {category.articles} articles
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-twitter-instagram-gradient transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-twitter-instagram-gradient">Articles populaires</h2>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-twitter-instagram-gradient/5 transition-colors duration-300 cursor-pointer group"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 group-hover:text-twitter-instagram-gradient transition-colors duration-300">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{article.views}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-twitter-instagram-gradient transition-colors duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Support */}
      <Card className="border-border/50 bg-twitter-instagram-gradient/5 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
          <h3 className="text-lg font-semibold mb-2 text-twitter-instagram-gradient">
            Vous ne trouvez pas ce que vous cherchez ?
          </h3>
          <p className="text-muted-foreground mb-4">Notre équipe support est là pour vous aider 24h/7j</p>
          <Button className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter le support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
