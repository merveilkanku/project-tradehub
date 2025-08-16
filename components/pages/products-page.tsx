"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, MapPin, Search, SlidersHorizontal, Grid, List, Filter } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { AdvancedSearchModal } from "@/components/search/advanced-search-modal"
import { SearchFiltersBar } from "@/components/search/search-filters-bar"
import { SearchSuggestions } from "@/components/search/search-suggestions"
import { StartConversationModal } from "@/components/chat/start-conversation-modal"

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

interface SearchFilters {
  query: string
  category: string
  country: string
  city: string
  minPrice: number
  maxPrice: number
  currency: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export function ProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    country: "",
    city: "",
    minPrice: 0,
    maxPrice: 10000,
    currency: "USD",
    sortBy: "created_at",
    sortOrder: "desc",
  })

  useEffect(() => {
    loadProducts()
  }, [user, filters])

  const loadProducts = async () => {
    setLoading(true)

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

    // Apply filters
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    }

    if (filters.category) {
      query = query.eq("category", filters.category)
    }

    if (filters.country) {
      query = query.eq("country", filters.country)
    }

    if (filters.city) {
      query = query.eq("city", filters.city)
    }

    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      query = query.gte("price", filters.minPrice).lte("price", filters.maxPrice)
    }

    if (filters.currency !== "USD") {
      query = query.eq("currency", filters.currency)
    }

    // Apply sorting
    const ascending = filters.sortOrder === "asc"
    query = query.order(filters.sortBy, { ascending })

    const { data, error } = await query

    if (data && !error) {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

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

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    if (key === "minPrice") {
      setFilters((prev) => ({ ...prev, minPrice: 0, maxPrice: 10000 }))
    } else {
      setFilters((prev) => ({ ...prev, [key]: key === "sortBy" ? "created_at" : key === "sortOrder" ? "desc" : "" }))
    }
  }

  const handleClearAllFilters = () => {
    setFilters({
      query: "",
      category: "",
      country: "",
      city: "",
      minPrice: 0,
      maxPrice: 10000,
      currency: "USD",
      sortBy: "created_at",
      sortOrder: "desc",
    })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFilters((prev) => ({ ...prev, query: suggestion }))
    setShowSuggestions(false)
  }

  const handleContactProduct = (product: Product) => {
    if (!user) return
    setSelectedProduct(product)
    setShowContactModal(true)
  }

  const handleConversationStarted = (conversationId: string) => {
    // Could navigate to discussions page or show success message
    console.log("Conversation started:", conversationId)
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-instagram-gradient">Produits</h1>
          <p className="text-muted-foreground">Découvrez les meilleurs produits de votre région</p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Enhanced Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des produits..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-12 focus:ring-instagram-gradient/20 border-border/50 bg-card/50 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-instagram-gradient/10"
            onClick={() => setShowAdvancedSearch(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <SearchSuggestions
            query={filters.query}
            onSuggestionClick={handleSuggestionClick}
            isVisible={showSuggestions}
          />
        </div>

        {/* Active Filters */}
        <SearchFiltersBar
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          onOpenAdvanced={() => setShowAdvancedSearch(true)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {loading ? "Chargement..." : `${products.length} produit(s) trouvé(s)`}
          </span>
          {products.length > 0 && (
            <Badge variant="secondary" className="bg-instagram-gradient/10 text-instagram-gradient">
              <Filter className="h-3 w-3 mr-1" />
              Filtré
            </Badge>
          )}
        </div>
        {filters.sortBy !== "created_at" && (
          <span className="text-sm text-muted-foreground">
            Trié par{" "}
            {filters.sortBy === "price"
              ? "prix"
              : filters.sortBy === "title"
                ? "nom"
                : filters.sortBy === "updated_at"
                  ? "mise à jour"
                  : "date"}{" "}
            ({filters.sortOrder === "asc" ? "croissant" : "décroissant"})
          </span>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse border-border/50 bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-r from-muted via-muted/50 to-muted shimmer"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-2/3 shimmer"></div>
                  <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-instagram-gradient/5 hover:border-instagram-gradient/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0] || `/placeholder.svg?height=200&width=400&query=product+${product.category}`}
                    alt={product.title}
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${viewMode === "grid" ? "w-full h-48" : "w-full h-48"}`}
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
                      Disponible
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg line-clamp-1 group-hover:text-instagram-gradient transition-colors duration-300">
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
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {product.country}
                          <span>• En ligne</span>
                        </div>
                      </div>
                    </div>

                    {user && (
                      <Button
                        size="sm"
                        onClick={() => handleContactProduct(product)}
                        className="bg-instagram-gradient hover:bg-instagram-gradient/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

          {products.length === 0 && !loading && (
            <div className="col-span-full">
              <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-instagram-gradient/10 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-instagram-gradient" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-instagram-gradient">Aucun produit trouvé</h3>
                    <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    className="bg-transparent hover:bg-instagram-gradient/10 border-instagram-gradient/30"
                  >
                    Effacer les filtres
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleSearch}
        initialFilters={filters}
      />

      {/* Contact Modal */}
      {selectedProduct && (
        <StartConversationModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          supplier={{
            id: selectedProduct.supplier_id,
            full_name: selectedProduct.profiles.full_name,
            avatar_url: selectedProduct.profiles.avatar_url,
          }}
          product={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            images: selectedProduct.images,
          }}
          onConversationStarted={handleConversationStarted}
        />
      )}
    </div>
  )
}
