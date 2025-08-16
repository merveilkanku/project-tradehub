"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, MapPin, Search, Star, Package, Users, TrendingUp, Award } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface Supplier {
  id: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  city: string
  country: string
  is_verified: boolean
  created_at: string
  product_count: number
  rating: number
  total_sales: number
}

export function SuppliersPage() {
  const { user } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadSuppliers()
  }, [user, searchQuery, selectedCountry, sortBy])

  const loadSuppliers = async () => {
    setLoading(true)

    let query = supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        bio,
        avatar_url,
        city,
        country,
        is_verified,
        created_at
      `)
      .eq("user_type", "supplier")
      .eq("payment_status", "paid")

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
    }

    if (selectedCountry !== "all") {
      query = query.eq("country", selectedCountry)
    } else if (user?.profile && !searchQuery) {
      // If user is logged in and no specific country selected, prioritize user's region
      query = query.eq("country", user.profile.country)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "name":
        query = query.order("full_name", { ascending: true })
        break
    }

    const { data: suppliersData, error } = await query

    if (suppliersData && !error) {
      // Get product counts and mock ratings for each supplier
      const suppliersWithCounts = await Promise.all(
        suppliersData.map(async (supplier) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("supplier_id", supplier.id)
            .eq("is_active", true)

          return {
            ...supplier,
            product_count: count || 0,
            rating: 4.2 + Math.random() * 0.6, // Mock rating between 4.2-4.8
            total_sales: Math.floor(Math.random() * 500) + 50, // Mock sales
          }
        }),
      )

      setSuppliers(suppliersWithCounts)
    }
    setLoading(false)
  }

  const getFilteredSuppliers = () => {
    let filtered = suppliers

    switch (activeTab) {
      case "verified":
        filtered = suppliers.filter((s) => s.is_verified)
        break
      case "top-rated":
        filtered = suppliers.filter((s) => s.rating >= 4.5)
        break
      case "new":
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        filtered = suppliers.filter((s) => new Date(s.created_at) > oneMonthAgo)
        break
      default:
        filtered = suppliers
    }

    return filtered
  }

  const filteredSuppliers = getFilteredSuppliers()

  const getSupplierStats = () => {
    return {
      all: suppliers.length,
      verified: suppliers.filter((s) => s.is_verified).length,
      topRated: suppliers.filter((s) => s.rating >= 4.5).length,
      new: suppliers.filter((s) => {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return new Date(s.created_at) > oneMonthAgo
      }).length,
    }
  }

  const stats = getSupplierStats()

  const countries = [...new Set(suppliers.map((s) => s.country))].sort()

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-instagram-gradient">Nos Fournisseurs</h1>
        <p className="text-muted-foreground">Découvrez les meilleurs fournisseurs de votre région</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-instagram-gradient mx-auto mb-2" />
            <div className="text-2xl font-bold text-instagram-gradient">{stats.all}</div>
            <div className="text-sm text-muted-foreground">Fournisseurs</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">{stats.verified}</div>
            <div className="text-sm text-muted-foreground">Vérifiés</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">{stats.topRated}</div>
            <div className="text-sm text-muted-foreground">Top notés</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">{stats.new}</div>
            <div className="text-sm text-muted-foreground">Nouveaux</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des fournisseurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-instagram-gradient/20"
          />
        </div>

        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full md:w-48 focus:ring-instagram-gradient/20">
            <SelectValue placeholder="Tous les pays" />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem value="all">Tous les pays</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 focus:ring-instagram-gradient/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="name">Par nom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suppliers Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tous ({stats.all})</TabsTrigger>
          <TabsTrigger value="verified">Vérifiés ({stats.verified})</TabsTrigger>
          <TabsTrigger value="top-rated">Top notés ({stats.topRated})</TabsTrigger>
          <TabsTrigger value="new">Nouveaux ({stats.new})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-instagram-gradient/5"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={
                              supplier.avatar_url ||
                              `/placeholder.svg?height=64&width=64&query=avatar+${supplier.full_name || "/placeholder.svg"}`
                            }
                            alt={supplier.full_name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-instagram-gradient/20"
                          />
                          {supplier.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                              <Award className="h-3 w-3 fill-current" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-lg text-instagram-gradient">{supplier.full_name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {supplier.city}, {supplier.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {supplier.bio && <p className="text-sm text-muted-foreground line-clamp-2">{supplier.bio}</p>}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          {supplier.product_count} produits
                        </div>
                        <div className="text-muted-foreground">{supplier.total_sales} ventes</div>
                      </div>

                      {user && (
                        <Button className="w-full bg-instagram-gradient hover:bg-instagram-gradient/90">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contacter
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSuppliers.length === 0 && !loading && (
                <div className="col-span-full">
                  <Card className="p-8 text-center border-border/50 bg-card/50 backdrop-blur-sm">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun fournisseur trouvé</p>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
