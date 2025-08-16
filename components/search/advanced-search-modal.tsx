"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"

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

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (filters: SearchFilters) => void
  initialFilters: SearchFilters
}

interface Country {
  name: string
  code: string
}

interface City {
  name: string
  country_code: string
}

interface Category {
  name: string
  slug: string
}

export function AdvancedSearchModal({ isOpen, onClose, onSearch, initialFilters }: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

  useEffect(() => {
    const loadData = async () => {
      // Load countries
      const { data: countriesData } = await supabase.from("countries").select("name, code").order("name")
      if (countriesData) setCountries(countriesData)

      // Load categories
      const { data: categoriesData } = await supabase.from("categories").select("name, slug").order("name")
      if (categoriesData) setCategories(categoriesData)
    }
    loadData()
  }, [])

  useEffect(() => {
    // Load cities when country changes
    if (filters.country) {
      const loadCities = async () => {
        const { data: citiesData } = await supabase
          .from("cities")
          .select("name, country_code")
          .eq("country_code", filters.country)
          .order("name")
        if (citiesData) setCities(citiesData)
      }
      loadCities()
    } else {
      setCities([])
      setFilters((prev) => ({ ...prev, city: "" }))
    }
  }, [filters.country])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setFilters((prev) => ({ ...prev, minPrice: values[0], maxPrice: values[1] }))
  }

  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: "",
      category: "",
      country: "",
      city: "",
      minPrice: 0,
      maxPrice: 10000,
      currency: "USD",
      sortBy: "created_at",
      sortOrder: "desc",
    }
    setFilters(resetFilters)
    setPriceRange([0, 10000])
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.category) count++
    if (filters.country) count++
    if (filters.city) count++
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++
    return count
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche avancée
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} filtres
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="query">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="query"
                placeholder="Nom du produit, description..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Localisation</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.city}
                onValueChange={(value) => handleFilterChange("city", value)}
                disabled={!filters.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fourchette de prix</Label>
              <div className="flex items-center gap-2">
                <Select value={filters.currency} onValueChange={(value) => handleFilterChange("currency", value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CDF">CDF</SelectItem>
                    <SelectItem value="XAF">XAF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {priceRange[0]} {filters.currency}
                </span>
                <span>
                  {priceRange[1]} {filters.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label>Trier par</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date de création</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="title">Nom</SelectItem>
                  <SelectItem value="updated_at">Dernière mise à jour</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") => handleFilterChange("sortOrder", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Décroissant</SelectItem>
                  <SelectItem value="asc">Croissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
              Réinitialiser
            </Button>
            <Button onClick={handleSearch} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
