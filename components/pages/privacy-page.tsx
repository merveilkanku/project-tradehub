"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, AlertTriangle, CheckCircle } from "lucide-react"

interface PrivacyPageProps {
  onBack: () => void
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
  const dataTypes = [
    {
      icon: Users,
      title: "Informations personnelles",
      description: "Nom, email, téléphone, adresse",
      usage: "Création de compte et communication",
    },
    {
      icon: Eye,
      title: "Données d'utilisation",
      description: "Pages visitées, interactions, préférences",
      usage: "Amélioration de l'expérience utilisateur",
    },
    {
      icon: Database,
      title: "Données commerciales",
      description: "Historique d'achats, évaluations, messages",
      usage: "Facilitation des transactions",
    },
  ]

  const rights = [
    "Accéder à vos données personnelles",
    "Rectifier des informations incorrectes",
    "Supprimer votre compte et vos données",
    "Limiter le traitement de vos données",
    "Portabilité de vos données",
    "Opposition au traitement",
  ]

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-twitter-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-twitter-instagram-gradient">Politique de confidentialité</h1>
      </div>

      {/* Introduction */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Notre engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Chez TradHub, nous prenons la protection de vos données personnelles très au sérieux. Cette politique
            explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conforme RGPD
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Lock className="h-3 w-3 mr-1" />
              Chiffrement SSL
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-twitter-instagram-gradient">Données que nous collectons</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dataTypes.map((type) => (
            <Card key={type.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <type.icon className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
                <h3 className="font-semibold mb-2 text-twitter-instagram-gradient">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                <Badge variant="outline" className="text-xs">
                  {type.usage}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Usage */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient">Comment nous utilisons vos données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Utilisation principale</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Création et gestion de votre compte</li>
                <li>• Facilitation des transactions</li>
                <li>• Communication avec les autres utilisateurs</li>
                <li>• Support client et assistance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Amélioration du service</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personnalisation de l'expérience</li>
                <li>• Analyse des tendances d'utilisation</li>
                <li>• Prévention de la fraude</li>
                <li>• Développement de nouvelles fonctionnalités</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient">Vos droits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          <div className="grid md:grid-cols-2 gap-2">
            {rights.map((right, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{right}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité des données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données
            contre tout accès non autorisé, altération, divulgation ou destruction.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-twitter-instagram-gradient" />
              <h4 className="font-medium mb-1">Chiffrement</h4>
              <p className="text-xs text-muted-foreground">SSL/TLS pour toutes les communications</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-twitter-instagram-gradient" />
              <h4 className="font-medium mb-1">Protection</h4>
              <p className="text-xs text-muted-foreground">Serveurs sécurisés et accès restreint</p>
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-twitter-instagram-gradient" />
              <h4 className="font-medium mb-1">Sauvegarde</h4>
              <p className="text-xs text-muted-foreground">Sauvegardes régulières et sécurisées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-border/50 bg-twitter-instagram-gradient/5 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
          <h3 className="text-lg font-semibold mb-2 text-twitter-instagram-gradient">Questions sur vos données ?</h3>
          <p className="text-muted-foreground mb-4">Contactez notre délégué à la protection des données</p>
          <Button className="bg-twitter-instagram-gradient hover:bg-twitter-instagram-gradient/90 text-white">
            privacy@tradehub.africa
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
