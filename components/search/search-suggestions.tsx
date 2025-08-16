"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
  isVisible: boolean
}

export function SearchSuggestions({ query, onSuggestionClick, isVisible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [popularSearches] = useState([
    "smartphone",
    "ordinateur portable",
    "robe africaine",
    "café",
    "artisanat",
    "électronique",
    "mode",
    "alimentation",
  ])

  useEffect(() => {
    if (query.length >= 2) {
      const loadSuggestions = async () => {
        const { data } = await supabase
          .from("products")
          .select("title")
          .ilike("title", `%${query}%`)
          .eq("is_active", true)
          .limit(5)

        if (data) {
          const titles = data.map((product) => product.title)
          setSuggestions(titles)
        }
      }
      loadSuggestions()
    } else {
      setSuggestions([])
    }
  }, [query])

  if (!isVisible) return null

  const showSuggestions = query.length >= 2 && suggestions.length > 0
  const showPopular = query.length === 0

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
      <CardContent className="p-2">
        {showSuggestions && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Search className="h-3 w-3" />
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                <span className="truncate">{suggestion}</span>
              </Button>
            ))}
          </div>
        )}

        {showPopular && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Recherches populaires
            </div>
            {popularSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => onSuggestionClick(search)}
              >
                <TrendingUp className="h-4 w-4 mr-3 text-muted-foreground" />
                <span className="truncate">{search}</span>
              </Button>
            ))}
          </div>
        )}

        {!showSuggestions && !showPopular && (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            Tapez au moins 2 caractères pour voir les suggestions
          </div>
        )}
      </CardContent>
    </Card>
  )
}
