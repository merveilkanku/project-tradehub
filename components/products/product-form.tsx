"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { X, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface ProductFormProps {
  product?: any
  onSave: (product: any) => void
  onCancel: () => void
}

interface Category {
  name: string
  slug: string
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    currency: product?.currency || "USD",
    category: product?.category || "",
    stock_quantity: product?.stock_quantity || "",
    is_active: product?.is_active ?? true,
    images: product?.images || [],
  })
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from("categories").select("name, slug").order("name")
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleImageAdd = () => {
    const url = prompt("URL de l'image:")
    if (url) {
      const newImages = [...imageUrls, url]
      setImageUrls(newImages)
      setFormData((prev) => ({ ...prev, images: newImages }))
    }
  }

  const handleImageRemove = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImages)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      setError("Veuillez remplir tous les champs obligatoires")
      return false
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Le prix doit être un nombre positif")
      return false
    }
    if (isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      setError("La quantité en stock doit être un nombre positif ou zéro")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        supplier_id: user?.id,
        country: user?.profile?.country,
        city: user?.profile?.city,
      }

      if (product) {
        // Update existing product
        const { data, error } = await supabase
          .from("products")
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq("id", product.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        // Create new product
        const { data, error } = await supabase.from("products").insert(productData).select().single()

        if (error) throw error
        onSave(data)
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Modifier le produit" : "Ajouter un produit"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du produit *</Label>
              <Input
                id="title"
                placeholder="Nom de votre produit"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre produit en détail"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Quantité en stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Images du produit</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleImageAdd} disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                Ajouter une image
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Produit ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Statut du produit</Label>
              <p className="text-sm text-muted-foreground">Le produit sera visible aux acheteurs</p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              disabled={loading}
            />
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : product ? (
                "Mettre à jour"
              ) : (
                "Créer le produit"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
