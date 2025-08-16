"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Globe, Shield, Heart, Star, MapPin, TrendingUp } from "lucide-react"

interface AboutPageProps {
  onBack: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  const stats = [
    { icon: Users, label: "Utilisateurs actifs", value: "10,000+", color: "text-blue-500" },
    { icon: Globe, label: "Pays couverts", value: "20", color: "text-green-500" },
    { icon: Star, label: "Note moyenne", value: "4.8/5", color: "text-yellow-500" },
    { icon: TrendingUp, label: "Croissance mensuelle", value: "+25%", color: "text-purple-500" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion pour l'Afrique",
      description:
        "Nous croyons au potentiel immense de l'Afrique francophone et nous nous engageons à connecter ses communautés.",
    },
    {
      icon: Shield,
      title: "Confiance et Sécurité",
      description:
        "Chaque transaction est protégée par nos systèmes de sécurité avancés et notre équipe de modération.",
    },
    {
      icon: Users,
      title: "Communauté d'abord",
      description:
        "Nous plaçons notre communauté au cœur de tout ce que nous faisons, en écoutant et en répondant à leurs besoins.",
    },
  ]

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-twitter-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-twitter-instagram-gradient">À propos de TradHub</h1>
      </div>

      {/* Hero Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="bg-twitter-instagram-gradient/10 p-8 text-center">
          <div className="w-16 h-16 bg-twitter-instagram-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-twitter-instagram-gradient">
            La marketplace qui connecte l'Afrique francophone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            TradHub est née de la vision de créer un pont numérique entre les entrepreneurs, artisans et consommateurs
            de l'Afrique francophone, favorisant le commerce local et l'économie circulaire.
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-twitter-instagram-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient">Notre Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Démocratiser le commerce électronique en Afrique francophone en offrant une plateforme accessible, sécurisée
            et adaptée aux réalités locales. Nous facilitons les échanges commerciaux entre les pays francophones
            africains tout en préservant les spécificités culturelles et économiques de chaque région.
          </p>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-twitter-instagram-gradient" />
            <span className="text-sm font-medium">Présent dans 20 pays d'Afrique francophone</span>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-twitter-instagram-gradient">Nos Valeurs</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card
              key={value.title}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-twitter-instagram-gradient" />
                <h4 className="font-semibold mb-2 text-twitter-instagram-gradient">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-twitter-instagram-gradient">Notre Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            TradHub est développé par une équipe passionnée d'entrepreneurs et de développeurs africains qui comprennent
            les défis et opportunités uniques du continent. Notre équipe multiculturelle travaille depuis Kinshasa,
            Dakar, Abidjan et Yaoundé pour créer des solutions adaptées à nos communautés.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient">
              🇨🇩 RDC
            </Badge>
            <Badge variant="secondary" className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient">
              🇸🇳 Sénégal
            </Badge>
            <Badge variant="secondary" className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient">
              🇨🇮 Côte d'Ivoire
            </Badge>
            <Badge variant="secondary" className="bg-twitter-instagram-gradient/10 text-twitter-instagram-gradient">
              🇨🇲 Cameroun
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
