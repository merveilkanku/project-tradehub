"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, MapPin, Calendar, Edit3, Star, Package, MessageCircle, Shield, Crown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface UserProfileProps {
  onEdit: () => void
}

export function UserProfile({ onEdit }: UserProfileProps) {
  const { user } = useAuth()

  if (!user) return null

  const getUserInitials = (fullName: string | null | undefined) => {
    if (!fullName) return "U"
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isSupplier = user.profile?.user_type === "supplier"

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-instagram-gradient">Mon Profil</h1>
        <Button onClick={onEdit} className="bg-instagram-gradient hover:bg-instagram-gradient/90">
          <Edit3 className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Profile Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-instagram-gradient/20">
              <AvatarImage src={user.profile?.avatar_url || undefined} />
              <AvatarFallback className="text-lg bg-instagram-gradient text-white">
                {getUserInitials(user.profile?.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user.profile?.full_name || "Nom non défini"}</h2>
                {isSupplier && (
                  <Badge className="bg-instagram-gradient text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Fournisseur
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground">{user.profile?.bio || "Aucune biographie définie"}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Membre depuis {formatDate(user.profile?.created_at)}
                </div>
                {isSupplier && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.8 (127 avis)
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-instagram-gradient" />
            Informations de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                Téléphone
              </div>
              <p className="font-medium">{user.profile?.phone || "Non défini"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Localisation
              </div>
              <p className="font-medium">
                {user.profile?.city && user.profile?.country
                  ? `${user.profile.city}, ${user.profile.country}`
                  : "Non définie"}
              </p>
            </div>
          </div>

          {user.profile?.address && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Adresse complète
                </div>
                <p className="font-medium">{user.profile.address}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Statistics for Suppliers */}
      {isSupplier && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-instagram-gradient" />
              Statistiques Fournisseur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Package className="h-8 w-8 text-instagram-gradient" />
                </div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Produits</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-instagram-gradient" />
                </div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Information */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-instagram-gradient" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Email</div>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Type de compte</div>
              <Badge
                variant={isSupplier ? "default" : "secondary"}
                className={isSupplier ? "bg-instagram-gradient" : ""}
              >
                {isSupplier ? "Fournisseur" : "Utilisateur Simple"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Dernière mise à jour</div>
            <p className="font-medium">{formatDate(user.profile?.updated_at)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
