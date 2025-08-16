"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContactPageProps {
  onBack: () => void
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Réponse immédiate",
      action: "Démarrer le chat",
      available: "24h/7j",
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@tradehub.africa",
      action: "Envoyer un email",
      available: "Réponse sous 2h",
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "+243 XX XXX XXXX",
      action: "Appeler",
      available: "Lun-Ven 8h-18h",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSuccess(true)
    setLoading(false)
    setFormData({ name: "", email: "", subject: "", category: "", message: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-twitter-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-twitter-instagram-gradient">Nous contacter</h1>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {contactMethods.map((method) => (
          <Card
            key={method.title}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <method.icon className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
              <h3 className="font-semibold mb-2 text-twitter-instagram-gradient">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
                <Clock className="h-3 w-3" />
                <span>{method.available}</span>
              </div>
              <Button
                size="sm"
                className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white"
              >
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-twitter-instagram-gradient">Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-500 text-green-700 bg-green-50">
                <MessageCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="focus:ring-twitter-instagram-gradient/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="focus:ring-twitter-instagram-gradient/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="focus:ring-twitter-instagram-gradient/20">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support technique</SelectItem>
                    <SelectItem value="billing">Facturation</SelectItem>
                    <SelectItem value="partnership">Partenariat</SelectItem>
                    <SelectItem value="feedback">Commentaires</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                  className="focus:ring-twitter-instagram-gradient/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                  rows={5}
                  className="focus:ring-twitter-instagram-gradient/20"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="space-y-6">
          {/* Office Locations */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-twitter-instagram-gradient flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nos bureaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Kinshasa, RDC</h4>
                <p className="text-sm text-muted-foreground">Avenue de la Paix, Gombe</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Dakar, Sénégal</h4>
                <p className="text-sm text-muted-foreground">Plateau, Avenue Léopold Sédar Senghor</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Abidjan, Côte d'Ivoire</h4>
                <p className="text-sm text-muted-foreground">Plateau, Boulevard de la République</p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Quick Links */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-twitter-instagram-gradient">Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                className="justify-start h-auto p-3 hover:bg-twitter-instagram-gradient/10 w-full"
              >
                <span className="text-sm">Comment créer un compte fournisseur ?</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto p-3 hover:bg-twitter-instagram-gradient/10 w-full"
              >
                <span className="text-sm">Quels sont les frais de transaction ?</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto p-3 hover:bg-twitter-instagram-gradient/10 w-full"
              >
                <span className="text-sm">Comment signaler un problème ?</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
