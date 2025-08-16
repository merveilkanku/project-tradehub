"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Phone, MapPin, Heart, Shield, FileText, Info, ExternalLink, Star } from "lucide-react"

interface AppFooterProps {
  onNavigate: (page: string) => void
}

export function AppFooter({ onNavigate }: AppFooterProps) {
  const supportLinks = [
    { icon: MessageCircle, label: "Support", page: "help" },
    { icon: Mail, label: "Contact", page: "contact" },
    { icon: Phone, label: "Aide", page: "help" },
    { icon: Info, label: "À propos", page: "about" },
  ]

  const legalLinks = [
    { icon: FileText, label: "Conditions", page: "terms" },
    { icon: Shield, label: "Confidentialité", page: "privacy" },
    { icon: FileText, label: "CGV", page: "cgv" },
  ]

  return (
    <footer className="mt-12 border-t border-border/50 bg-twitter-instagram-gradient/10 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-twitter-instagram-gradient opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-twitter-blue/20 via-transparent to-instagram-pink/20 animate-pulse"></div>
      </div>

      <div className="relative p-6 space-y-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-twitter-instagram-gradient rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-twitter-instagram-gradient">TradHub</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La marketplace qui connecte l'Afrique francophone. Achetez et vendez en toute confiance.
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient border-twitter-instagram-gradient/20"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                4.8/5
              </Badge>
              <span className="text-xs text-muted-foreground">+10,000 utilisateurs</span>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support & Aide</h4>
            <div className="grid grid-cols-2 gap-2">
              {supportLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(link.page)}
                  className="justify-start h-auto p-3 hover:bg-twitter-instagram-gradient/10 hover:text-twitter-instagram-gradient transition-all duration-300 group"
                >
                  <link.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">{link.label}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              ))}
            </div>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Informations légales</h4>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(link.page)}
                  className="justify-start h-auto p-3 hover:bg-twitter-instagram-gradient/10 hover:text-twitter-instagram-gradient transition-all duration-300 group w-full"
                >
                  <link.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">{link.label}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <Card className="bg-twitter-instagram-gradient/5 border-twitter-instagram-gradient/20 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h4 className="font-semibold text-twitter-instagram-gradient mb-2">Besoin d'aide ?</h4>
                <p className="text-sm text-muted-foreground">
                  Notre équipe est disponible 24h/7j pour vous accompagner
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat en direct
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-twitter-instagram-gradient/30 hover:bg-twitter-instagram-gradient/10 hover:border-twitter-instagram-gradient/50 transition-all duration-300 bg-transparent"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 TradHub. Tous droits réservés.</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Afrique francophone</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Fait avec</span>
              <Heart className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">pour l'Afrique</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
