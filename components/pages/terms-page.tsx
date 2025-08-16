"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, AlertCircle, Info } from "lucide-react"

interface TermsPageProps {
  onBack: () => void
}

export function TermsPage({ onBack }: TermsPageProps) {
  const sections = [
    {
      title: "1. Acceptation des conditions",
      content:
        "En utilisant TradHub, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.",
    },
    {
      title: "2. Description du service",
      content:
        "TradHub est une marketplace qui connecte les acheteurs et vendeurs en Afrique francophone. Nous facilitons les transactions commerciales mais ne sommes pas partie aux contrats entre utilisateurs.",
    },
    {
      title: "3. Inscription et compte utilisateur",
      content:
        "Vous devez fournir des informations exactes lors de l'inscription. Vous êtes responsable de la sécurité de votre compte et de toutes les activités qui s'y déroulent.",
    },
    {
      title: "4. Utilisation acceptable",
      content:
        "Vous vous engagez à utiliser TradHub de manière légale et respectueuse. Il est interdit de publier du contenu illégal, trompeur ou offensant.",
    },
    {
      title: "5. Transactions et paiements",
      content:
        "Les transactions se font directement entre utilisateurs. TradHub peut faciliter les paiements mais n'est pas responsable des litiges commerciaux.",
    },
    {
      title: "6. Propriété intellectuelle",
      content:
        "Le contenu de TradHub est protégé par les droits d'auteur. Vous conservez les droits sur le contenu que vous publiez mais accordez à TradHub une licence d'utilisation.",
    },
    {
      title: "7. Limitation de responsabilité",
      content:
        "TradHub n'est pas responsable des dommages directs ou indirects résultant de l'utilisation du service. Notre responsabilité est limitée au montant payé pour nos services.",
    },
    {
      title: "8. Modification des conditions",
      content:
        "Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés des changements importants.",
    },
  ]

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-twitter-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-twitter-instagram-gradient">Conditions d'utilisation</h1>
      </div>

      {/* Last Updated */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Dernière mise à jour : 15 décembre 2024</span>
          </div>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Bienvenue sur TradHub, la marketplace qui connecte l'Afrique francophone. Ces conditions d'utilisation
            régissent votre accès et votre utilisation de nos services. En utilisant TradHub, vous acceptez d'être lié
            par ces conditions.
          </p>
        </CardContent>
      </Card>

      {/* Terms Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-twitter-instagram-gradient">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact for Questions */}
      <Card className="border-border/50 bg-twitter-instagram-gradient/5 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
          <h3 className="text-lg font-semibold mb-2 text-twitter-instagram-gradient">Questions sur nos conditions ?</h3>
          <p className="text-muted-foreground mb-4">
            Notre équipe juridique est disponible pour clarifier toute question
          </p>
          <Button className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white">
            Nous contacter
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
