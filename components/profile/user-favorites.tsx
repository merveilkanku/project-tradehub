"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Heart, MessageCircle, MapPin, Search, Filter, Grid, List } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface UserFavoritesProps {
  onBack: () => void
}

interface FavoriteProduct {
  id: string
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  city: string
  country: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export function UserFavorites({ onBack }: UserFavoritesProps) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          products (
            *,
            profiles:supplier_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq("user_id", user.id)

      if (error) throw error

      const favoriteProducts = data?.map((fav: any) => fav.products).filter(Boolean) || []
      setFavorites(favoriteProducts)
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId: string) => {
    if (!user) return

    try {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)

      setFavorites((prev) => prev.filter((product) => product.id !== productId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const filteredFavorites = favorites.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-instagram-gradient">Mes favoris</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="hover:bg-instagram-gradient/10"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher dans mes favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-instagram-gradient/20"
          />
        </div>
        <Button variant="outline" className="hover:bg-instagram-gradient/10 bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Stats */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-instagram-gradient">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Produits favoris</p>
            </div>
            <Heart className="h-8 w-8 text-instagram-gradient" />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <Card className="p-8 text-center border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="space-y-3">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-medium">{searchQuery ? "Aucun résultat" : "Aucun favori"}</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Essayez avec d'autres mots-clés"
                  : "Ajoutez des produits à vos favoris pour les retrouver facilement"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {filteredFavorites.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className={`flex ${viewMode === "grid" ? "flex-col" : ""}`}>
                  <img
                    src={product.images[0] || `/placeholder.svg?height=200&width=200&query=product`}
                    alt={product.title}
                    className={`object-cover ${viewMode === "grid" ? "w-full h-48" : "w-24 h-24"}`}
                  />
                  <div className="flex-1 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg line-clamp-1">{product.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(product.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-instagram-gradient">
                        {product.price} {product.currency}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {product.city}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            product.profiles.avatar_url ||
                            `/placeholder.svg?height=32&width=32&query=avatar` ||
                            "/placeholder.svg"
                          }
                          alt={product.profiles.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium">{product.profiles.full_name}</span>
                      </div>

                      <Button size="sm" className="bg-instagram-gradient hover:bg-instagram-gradient/90">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
