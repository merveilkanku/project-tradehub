"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Star, Sparkles, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { AppFooter } from "@/components/layout/app-footer"
import { ContactSupplierModal } from "@/components/ui/contact-supplier-modal"

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  images: string[]
  city: string
  country: string
  supplier_id: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

interface HomePageProps {
  onNavigate?: (page: string) => void
}

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Smartphone Samsung Galaxy A54",
    description: "Téléphone intelligent avec écran AMOLED 6.4 pouces, 128GB de stockage",
    price: 350000,
    currency: "CDF",
    category: "Électronique",
    images: ["/samsung-smartphone.png"],
    city: "Kinshasa",
    country: "RDC",
    supplier_id: "1",
    profiles: {
      full_name: "Jean Mukendi",
      avatar_url: "/stylized-woman-denim.png",
    },
  },
  {
    id: "2",
    title: "Robe Africaine Traditionnelle",
    description: "Belle robe en wax authentique, taille M, parfaite pour les occasions spéciales",
    price: 45000,
    currency: "CDF",
    category: "Mode",
    images: ["/african-wax-robe.png"],
    city: "Lubumbashi",
    country: "RDC",
    supplier_id: "2",
    profiles: {
      full_name: "Marie Kabongo",
      avatar_url: "/avatar-marie.png",
    },
  },
  {
    id: "3",
    title: "Ordinateur Portable HP",
    description: "Laptop HP Pavilion 15, Intel i5, 8GB RAM, 256GB SSD, parfait pour le travail",
    price: 850000,
    currency: "CDF",
    category: "Électronique",
    images: ["/placeholder-hejft.png"],
    city: "Goma",
    country: "RDC",
    supplier_id: "3",
    profiles: {
      full_name: "Patrick Mwamba",
      avatar_url: "/stylized-man-avatar.png",
    },
  },
]

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set())
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean
    supplier: any
    product: any
  }>({
    isOpen: false,
    supplier: null,
    product: null,
  })

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        console.log("[v0] Loading featured products...")

        try {
          let query = supabase
            .from("products")
            .select(`
              *,
              profiles:supplier_id (
                full_name,
                avatar_url
              )
            `)
            .eq("is_active", true)
            .limit(10)

          if (user?.profile) {
            console.log("[v0] Filtering by user country:", user.profile.country)
            query = query.eq("country", user.profile.country)
          }

          console.log("[v0] Executing Supabase query...")
          const { data, error } = await query

          if (error) throw error

          if (data && data.length > 0) {
            console.log("[v0] Products loaded successfully:", data.length)
            setFeaturedProducts(data as Product[])
            setUsingMockData(false)
          } else {
            throw new Error("No products found")
          }
        } catch (supabaseError) {
          console.log("[v0] Using demo data for better experience")
          setFeaturedProducts(mockProducts)
          setUsingMockData(true)
        }
      } catch (err) {
        console.log("[v0] Demo mode activated")
        setFeaturedProducts(mockProducts)
        setUsingMockData(true)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [user])

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleContactSupplier = (product: Product) => {
    setContactModal({
      isOpen: true,
      supplier: {
        id: product.supplier_id,
        full_name: product.profiles.full_name,
        avatar_url: product.profiles.avatar_url,
        city: product.city,
        country: product.country,
      },
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
      },
    })
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-2/3 shimmer"></div>
        </div>

        <div className="flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full shimmer"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <CardContent className="p-0">
              <div className="h-48 bg-gradient-to-r from-muted via-muted/50 to-muted shimmer"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-3/4 shimmer"></div>
                <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {usingMockData && (
        <Card className="bg-instagram-gradient/10 border-instagram-gradient/20 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-instagram-gradient animate-pulse" />
              <p className="text-sm text-instagram-gradient font-medium">
                Mode démo actif - Testez toutes les fonctionnalités ! Les données sont des exemples.
              </p>
              <Sparkles className="h-4 w-4 text-instagram-gradient animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="relative">
          <h2 className="text-3xl font-bold text-instagram-gradient animate-gradient-text">
            {user ? `Bienvenue, ${user.profile?.full_name?.split(" ")[0]}!` : "Bienvenue sur TradHub"}
          </h2>
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <p className="text-muted-foreground text-lg">
          {user
            ? `Découvrez les meilleurs produits à ${user.profile?.city}`
            : "Découvrez les meilleurs produits d'Afrique francophone"}
        </p>
        {user && (
          <div className="flex items-center justify-center gap-2 text-sm text-instagram-gradient">
            <TrendingUp className="h-4 w-4" />
            <span>Nouveaux produits disponibles dans votre région</span>
          </div>
        )}
      </div>

      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-xl font-semibold text-instagram-gradient">Catégories populaires</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Électronique", "Mode", "Maison", "Alimentation", "Santé"].map((category, index) => (
            <Badge
              key={category}
              variant="secondary"
              className="whitespace-nowrap cursor-pointer hover:bg-instagram-gradient hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-xl font-semibold text-instagram-gradient">Produits en vedette</h3>
        <div className="space-y-6">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-instagram-gradient/5 hover:border-instagram-gradient/30 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0] || `/placeholder.svg?height=200&width=400&query=product+${product.category}`}
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {user && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleLike(product.id)}
                      className={`absolute top-3 right-3 backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                        likedProducts.has(product.id)
                          ? "bg-red-500/90 text-white hover:bg-red-600/90"
                          : "bg-background/80 hover:bg-background/90"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          likedProducts.has(product.id) ? "fill-current animate-pulse" : ""
                        }`}
                      />
                    </Button>
                  )}

                  <Badge className="absolute bottom-3 left-3 bg-instagram-gradient text-white shadow-lg backdrop-blur-sm">
                    {product.category}
                  </Badge>

                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      Nouveau
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-xl line-clamp-1 group-hover:text-instagram-gradient transition-colors duration-300">
                      {product.title}
                    </h4>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-instagram-gradient group-hover:scale-105 transition-transform duration-300">
                      {product.price} {product.currency}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-instagram-gradient transition-colors duration-300">
                      <MapPin className="h-4 w-4" />
                      {product.city}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            product.profiles.avatar_url ||
                            `/placeholder.svg?height=40&width=40&query=avatar+${product.profiles.full_name || "/placeholder.svg"}`
                          }
                          alt={product.profiles.full_name}
                          className="w-10 h-10 rounded-full ring-2 ring-instagram-gradient/20 group-hover:ring-instagram-gradient/40 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-instagram-gradient transition-colors duration-300">
                          {product.profiles.full_name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">4.8</span>
                          <span className="text-xs text-muted-foreground">• En ligne</span>
                        </div>
                      </div>
                    </div>

                    {user && (
                      <Button
                        size="sm"
                        className="bg-instagram-gradient hover:bg-instagram-gradient/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => handleContactSupplier(product)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!user && (
        <Card className="bg-instagram-gradient/10 border-instagram-gradient/30 backdrop-blur-sm animate-fade-in-up hover:bg-instagram-gradient/15 transition-all duration-300">
          <CardContent className="p-8 text-center space-y-4">
            <div className="relative">
              <h3 className="text-xl font-semibold text-instagram-gradient">Rejoignez TradHub</h3>
              <Sparkles className="absolute -top-1 -right-8 h-5 w-5 text-instagram-gradient animate-pulse" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Connectez-vous pour interagir avec les vendeurs, liker des produits et passer des commandes
            </p>
            <Button className="bg-instagram-gradient hover:bg-instagram-gradient/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Commencer maintenant
            </Button>
          </CardContent>
        </Card>
      )}

      <AppFooter onNavigate={onNavigate || (() => {})} />

      <ContactSupplierModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false, supplier: null, product: null })}
        supplier={contactModal.supplier}
        product={contactModal.product}
      />
    </div>
  )
}
