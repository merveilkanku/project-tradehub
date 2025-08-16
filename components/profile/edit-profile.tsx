"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Save, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"

interface EditProfileProps {
  onBack: () => void
}

const FRANCOPHONE_COUNTRIES = [
  {
    code: "CD",
    name: "République Démocratique du Congo",
    cities: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani", "Kananga", "Likasi", "Kolwezi", "Tshikapa"],
  },
  {
    code: "CM",
    name: "Cameroun",
    cities: ["Yaoundé", "Douala", "Bamenda", "Bafoussam", "Garoua", "Maroua", "Ngaoundéré", "Bertoua"],
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    cities: ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San-Pédro", "Korhogo", "Man", "Divo"],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    cities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora", "Kaya", "Tenkodogo", "Orodara"],
  },
  {
    code: "ML",
    name: "Mali",
    cities: ["Bamako", "Sikasso", "Mopti", "Koutiala", "Ségou", "Kayes", "Gao", "Tombouctou"],
  },
  {
    code: "SN",
    name: "Sénégal",
    cities: ["Dakar", "Thiès", "Kaolack", "Saint-Louis", "Ziguinchor", "Diourbel", "Tambacounda", "Mbour"],
  },
  {
    code: "NE",
    name: "Niger",
    cities: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso", "Tillabéri", "Diffa"],
  },
  {
    code: "GN",
    name: "Guinée",
    cities: ["Conakry", "Nzérékoré", "Kankan", "Kindia", "Labe", "Mamou", "Boke", "Faranah"],
  },
  {
    code: "TD",
    name: "Tchad",
    cities: ["N'Djamena", "Moundou", "Sarh", "Abéché", "Kelo", "Koumra", "Pala", "Am Timan"],
  },
  {
    code: "CG",
    name: "République du Congo",
    cities: ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Impfondo", "Ouesso", "Madingou", "Owando"],
  },
]

export function EditProfile({ onBack }: EditProfileProps) {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    country: user?.profile?.country || "",
    bio: user?.profile?.bio || "",
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide")
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validation
    if (!formData.full_name.trim()) {
      setError("Le nom complet est requis")
      return
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis")
      return
    }
    if (!formData.country) {
      setError("Veuillez sélectionner un pays")
      return
    }
    if (!formData.city) {
      setError("Veuillez sélectionner une ville")
      return
    }

    setLoading(true)
    setError("")

    try {
      let avatarUrl = user.profile?.avatar_url

      // Upload avatar if changed
      if (avatarFile && !user.id.startsWith("demo_")) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile)

        if (uploadError) {
          console.log("[v0] Avatar upload failed, using placeholder")
          avatarUrl = `/placeholder.svg?height=100&width=100&query=avatar+${formData.full_name}`
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(fileName)
          avatarUrl = publicUrl
        }
      } else if (avatarFile) {
        avatarUrl = `/placeholder.svg?height=100&width=100&query=avatar+${formData.full_name}`
      }

      await AuthService.updateProfile(user.id, {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city,
        country: formData.country,
        bio: formData.bio.trim(),
        avatar_url: avatarUrl,
      })

      await refreshUser()
      setSuccess("Profil mis à jour avec succès!")
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Erreur lors de la mise à jour du profil")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const selectedCountry = FRANCOPHONE_COUNTRIES.find((c) => c.name === formData.country)
  const availableCities = selectedCountry?.cities || []

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-instagram-gradient">Modifier le profil</h1>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-instagram-gradient" />
              Photo de profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 ring-2 ring-instagram-gradient/20">
                <AvatarImage src={avatarPreview || user?.profile?.avatar_url || undefined} />
                <AvatarFallback className="text-lg bg-instagram-gradient text-white">
                  {formData.full_name ? getUserInitials(formData.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:bg-instagram-gradient/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Changer la photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Formats acceptés: JPG, PNG. Taille maximale: 2MB</p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                required
                className="focus:ring-instagram-gradient/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                className="focus:ring-instagram-gradient/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                placeholder="Parlez-nous de vous..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className="focus:ring-instagram-gradient/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Localisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                className="focus:ring-instagram-gradient/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => {
                    handleInputChange("country", value)
                    handleInputChange("city", "") // Reset city when country changes
                  }}
                >
                  <SelectTrigger className="focus:ring-instagram-gradient/20">
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {FRANCOPHONE_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleInputChange("city", value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="focus:ring-instagram-gradient/20">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 hover:bg-instagram-gradient/10 bg-transparent"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-instagram-gradient hover:bg-instagram-gradient/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
