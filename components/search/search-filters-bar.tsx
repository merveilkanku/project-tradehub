"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"

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

interface SearchFiltersBarProps {
  filters: SearchFilters
  onRemoveFilter: (key: keyof SearchFilters) => void
  onClearAll: () => void
  onOpenAdvanced: () => void
}

export function SearchFiltersBar({ filters, onRemoveFilter, onClearAll, onOpenAdvanced }: SearchFiltersBarProps) {
  const getActiveFilters = () => {
    const active = []

    if (filters.query) {
      active.push({ key: "query" as keyof SearchFilters, label: `"${filters.query}"`, value: filters.query })
    }
    if (filters.category) {
      active.push({ key: "category" as keyof SearchFilters, label: filters.category, value: filters.category })
    }
    if (filters.country) {
      active.push({ key: "country" as keyof SearchFilters, label: `Pays: ${filters.country}`, value: filters.country })
    }
    if (filters.city) {
      active.push({ key: "city" as keyof SearchFilters, label: `Ville: ${filters.city}`, value: filters.city })
    }
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      active.push({
        key: "minPrice" as keyof SearchFilters,
        label: `${filters.minPrice}-${filters.maxPrice} ${filters.currency}`,
        value: `${filters.minPrice}-${filters.maxPrice}`,
      })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground">Aucun filtre appliqué</div>
        <Button variant="outline" size="sm" onClick={onOpenAdvanced}>
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{activeFilters.length} filtre(s) appliqué(s)</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onOpenAdvanced}>
            <Filter className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={onClearAll}>
            Tout effacer
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge key={filter.key} variant="secondary" className="flex items-center gap-1 px-3 py-1">
            {filter.label}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => onRemoveFilter(filter.key)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
