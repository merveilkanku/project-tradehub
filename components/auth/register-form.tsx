"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Loader2, CreditCard, Phone } from "lucide-react"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

interface Country {
  name: string
  code: string
}

interface City {
  name: string
  country_code: string
}

const FRANCOPHONE_COUNTRIES: Country[] = [
  { name: "République Démocratique du Congo", code: "CD" },
  { name: "Cameroun", code: "CM" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Mali", code: "ML" },
  { name: "Sénégal", code: "SN" },
  { name: "Niger", code: "NE" },
  { name: "Guinée", code: "GN" },
  { name: "Rwanda", code: "RW" },
  { name: "Burundi", code: "BI" },
  { name: "Tchad", code: "TD" },
  { name: "République Centrafricaine", code: "CF" },
  { name: "Gabon", code: "GA" },
  { name: "République du Congo", code: "CG" },
  { name: "Comores", code: "KM" },
  { name: "Djibouti", code: "DJ" },
  { name: "Madagascar", code: "MG" },
  { name: "Seychelles", code: "SC" },
  { name: "Bénin", code: "BJ" },
  { name: "Togo", code: "TG" },
  { name: "France", code: "FR" },
  { name: "Canada", code: "CA" },
  { name: "Belgique", code: "BE" },
  { name: "Suisse", code: "CH" },
]

const FRANCOPHONE_CITIES: City[] = [
  // République Démocratique du Congo
  { name: "Kinshasa", country_code: "CD" },
  { name: "Lubumbashi", country_code: "CD" },
  { name: "Mbuji-Mayi", country_code: "CD" },
  { name: "Kisangani", country_code: "CD" },
  { name: "Bukavu", country_code: "CD" },
  { name: "Goma", country_code: "CD" },
  { name: "Kananga", country_code: "CD" },
  { name: "Likasi", country_code: "CD" },
  { name: "Kolwezi", country_code: "CD" },
  { name: "Matadi", country_code: "CD" },

  // Cameroun
  { name: "Yaoundé", country_code: "CM" },
  { name: "Douala", country_code: "CM" },
  { name: "Bamenda", country_code: "CM" },
  { name: "Bafoussam", country_code: "CM" },
  { name: "Garoua", country_code: "CM" },
  { name: "Maroua", country_code: "CM" },
  { name: "Ngaoundéré", country_code: "CM" },
  { name: "Bertoua", country_code: "CM" },
  { name: "Ebolowa", country_code: "CM" },
  { name: "Kumba", country_code: "CM" },

  // Côte d'Ivoire
  { name: "Abidjan", country_code: "CI" },
  { name: "Yamoussoukro", country_code: "CI" },
  { name: "Bouaké", country_code: "CI" },
  { name: "Daloa", country_code: "CI" },
  { name: "San-Pédro", country_code: "CI" },
  { name: "Korhogo", country_code: "CI" },
  { name: "Man", country_code: "CI" },
  { name: "Divo", country_code: "CI" },
  { name: "Gagnoa", country_code: "CI" },
  { name: "Abengourou", country_code: "CI" },

  // Burkina Faso
  { name: "Ouagadougou", country_code: "BF" },
  { name: "Bobo-Dioulasso", country_code: "BF" },
  { name: "Koudougou", country_code: "BF" },
  { name: "Ouahigouya", country_code: "BF" },
  { name: "Banfora", country_code: "BF" },
  { name: "Kaya", country_code: "BF" },
  { name: "Tenkodogo", country_code: "BF" },
  { name: "Fada N'gourma", country_code: "BF" },
  { name: "Dori", country_code: "BF" },
  { name: "Gaoua", country_code: "BF" },

  // Mali
  { name: "Bamako", country_code: "ML" },
  { name: "Sikasso", country_code: "ML" },
  { name: "Mopti", country_code: "ML" },
  { name: "Koutiala", country_code: "ML" },
  { name: "Ségou", country_code: "ML" },
  { name: "Kayes", country_code: "ML" },
  { name: "Gao", country_code: "ML" },
  { name: "Tombouctou", country_code: "ML" },
  { name: "Kidal", country_code: "ML" },
  { name: "San", country_code: "ML" },

  // Sénégal
  { name: "Dakar", country_code: "SN" },
  { name: "Thiès", country_code: "SN" },
  { name: "Kaolack", country_code: "SN" },
  { name: "Saint-Louis", country_code: "SN" },
  { name: "Ziguinchor", country_code: "SN" },
  { name: "Diourbel", country_code: "SN" },
  { name: "Tambacounda", country_code: "SN" },
  { name: "Mbour", country_code: "SN" },
  { name: "Rufisque", country_code: "SN" },
  { name: "Kolda", country_code: "SN" },

  // Niger
  { name: "Niamey", country_code: "NE" },
  { name: "Zinder", country_code: "NE" },
  { name: "Maradi", country_code: "NE" },
  { name: "Agadez", country_code: "NE" },
  { name: "Tahoua", country_code: "NE" },
  { name: "Dosso", country_code: "NE" },
  { name: "Tillabéri", country_code: "NE" },
  { name: "Diffa", country_code: "NE" },
  { name: "Arlit", country_code: "NE" },
  { name: "Gaya", country_code: "NE" },

  // Guinée
  { name: "Conakry", country_code: "GN" },
  { name: "Nzérékoré", country_code: "GN" },
  { name: "Kankan", country_code: "GN" },
  { name: "Kindia", country_code: "GN" },
  { name: "Labé", country_code: "GN" },
  { name: "Mamou", country_code: "GN" },
  { name: "Boké", country_code: "GN" },
  { name: "Faranah", country_code: "GN" },
  { name: "Kissidougou", country_code: "GN" },
  { name: "Guéckédou", country_code: "GN" },

  // Rwanda
  { name: "Kigali", country_code: "RW" },
  { name: "Butare", country_code: "RW" },
  { name: "Gitarama", country_code: "RW" },
  { name: "Ruhengeri", country_code: "RW" },
  { name: "Gisenyi", country_code: "RW" },
  { name: "Byumba", country_code: "RW" },
  { name: "Cyangugu", country_code: "RW" },
  { name: "Kibungo", country_code: "RW" },
  { name: "Kibuye", country_code: "RW" },
  { name: "Gikongoro", country_code: "RW" },

  // Burundi
  { name: "Bujumbura", country_code: "BI" },
  { name: "Gitega", country_code: "BI" },
  { name: "Muyinga", country_code: "BI" },
  { name: "Ngozi", country_code: "BI" },
  { name: "Ruyigi", country_code: "BI" },
  { name: "Kayanza", country_code: "BI" },
  { name: "Cibitoke", country_code: "BI" },
  { name: "Bubanza", country_code: "BI" },
  { name: "Bururi", country_code: "BI" },
  { name: "Makamba", country_code: "BI" },

  // Tchad
  { name: "N'Djamena", country_code: "TD" },
  { name: "Moundou", country_code: "TD" },
  { name: "Sarh", country_code: "TD" },
  { name: "Abéché", country_code: "TD" },
  { name: "Kelo", country_code: "TD" },
  { name: "Koumra", country_code: "TD" },
  { name: "Pala", country_code: "TD" },
  { name: "Am Timan", country_code: "TD" },
  { name: "Bongor", country_code: "TD" },
  { name: "Mongo", country_code: "TD" },

  // République Centrafricaine
  { name: "Bangui", country_code: "CF" },
  { name: "Berbérati", country_code: "CF" },
  { name: "Carnot", country_code: "CF" },
  { name: "Bambari", country_code: "CF" },
  { name: "Bouar", country_code: "CF" },
  { name: "Bossangoa", country_code: "CF" },
  { name: "Bria", country_code: "CF" },
  { name: "Bangassou", country_code: "CF" },
  { name: "Nola", country_code: "CF" },
  { name: "Kaga-Bandoro", country_code: "CF" },

  // Gabon
  { name: "Libreville", country_code: "GA" },
  { name: "Port-Gentil", country_code: "GA" },
  { name: "Franceville", country_code: "GA" },
  { name: "Oyem", country_code: "GA" },
  { name: "Moanda", country_code: "GA" },
  { name: "Mouila", country_code: "GA" },
  { name: "Lambaréné", country_code: "GA" },
  { name: "Tchibanga", country_code: "GA" },
  { name: "Koulamoutou", country_code: "GA" },
  { name: "Makokou", country_code: "GA" },

  // République du Congo
  { name: "Brazzaville", country_code: "CG" },
  { name: "Pointe-Noire", country_code: "CG" },
  { name: "Dolisie", country_code: "CG" },
  { name: "Nkayi", country_code: "CG" },
  { name: "Impfondo", country_code: "CG" },
  { name: "Ouesso", country_code: "CG" },
  { name: "Madingou", country_code: "CG" },
  { name: "Owando", country_code: "CG" },
  { name: "Sibiti", country_code: "CG" },
  { name: "Mossendjo", country_code: "CG" },

  // Autres pays francophones (principales villes)
  { name: "Moroni", country_code: "KM" },
  { name: "Djibouti", country_code: "DJ" },
  { name: "Antananarivo", country_code: "MG" },
  { name: "Victoria", country_code: "SC" },
  { name: "Cotonou", country_code: "BJ" },
  { name: "Lomé", country_code: "TG" },
  { name: "Paris", country_code: "FR" },
  { name: "Montréal", country_code: "CA" },
  { name: "Bruxelles", country_code: "BE" },
  { name: "Genève", country_code: "CH" },
]

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<"simple" | "supplier">("simple")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    username: "",
    fullName: "",
    country: "",
    city: "",
    address: "",
  })
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [error, setError] = useState("")
  const [paymentInfo, setPaymentInfo] = useState("")
  const { signUp, loading } = useAuth()

  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log("[v0] Loading countries from Supabase...")
        const { data, error } = await supabase.from("countries").select("name, code").order("name")

        if (data && data.length > 0) {
          console.log("[v0] Countries loaded from Supabase:", data.length)
          setCountries(data)
        } else {
          console.log("[v0] No countries from Supabase, using fallback data")
          setCountries(FRANCOPHONE_COUNTRIES)
        }
      } catch (err) {
        console.log("[v0] Supabase countries error, using fallback:", err)
        setCountries(FRANCOPHONE_COUNTRIES)
      }
    }
    loadCountries()
  }, [])

  useEffect(() => {
    if (formData.country) {
      const loadCities = async () => {
        try {
          console.log("[v0] Loading cities for country:", formData.country)
          const { data, error } = await supabase
            .from("cities")
            .select("name, country_code")
            .eq("country_code", formData.country)
            .order("name")

          if (data && data.length > 0) {
            console.log("[v0] Cities loaded from Supabase:", data.length)
            setCities(data)
          } else {
            console.log("[v0] No cities from Supabase, using fallback data")
            const fallbackCities = FRANCOPHONE_CITIES.filter((city) => city.country_code === formData.country)
            setCities(fallbackCities)
          }
        } catch (err) {
          console.log("[v0] Supabase cities error, using fallback:", err)
          const fallbackCities = FRANCOPHONE_CITIES.filter((city) => city.country_code === formData.country)
          setCities(fallbackCities)
        }
      }
      loadCities()
    }
  }, [formData.country])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.phone || !formData.username || !formData.fullName) {
      setError("Veuillez remplir tous les champs")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.country || !formData.city || !formData.address) {
      setError("Veuillez remplir tous les champs de localisation")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      if (userType === "supplier") {
        setStep(4) // Payment step
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    try {
      await signUp({
        ...formData,
        userType,
      })
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
    }
  }

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-primary">Paiement Fournisseur</h3>
        <p className="text-sm text-muted-foreground">Frais d'inscription : 5 USD</p>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Options de paiement :</h4>

        {formData.country === "CD" ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm">Paiement mobile (RDC) :</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>+234979401982</p>
              <p>+243842578529</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm">Virement bancaire :</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Western Union ou autre service de votre choix</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentInfo">Référence de paiement</Label>
        <Input
          id="paymentInfo"
          placeholder="Numéro de transaction ou référence"
          value={paymentInfo}
          onChange={(e) => setPaymentInfo(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Votre compte sera activé après vérification du paiement</p>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">TradHub</CardTitle>
        <CardDescription>
          Créez votre compte - Étape {step} sur {userType === "supplier" ? 4 : 3}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Type de compte</Label>
              <RadioGroup value={userType} onValueChange={(value: "simple" | "supplier") => setUserType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple" className="text-sm">
                    Utilisateur simple (Gratuit)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier" id="supplier" />
                  <Label htmlFor="supplier" className="text-sm">
                    Fournisseur (5 USD)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Répétez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                placeholder="Votre nom complet"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="nom_utilisateur"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="+243 XXX XXX XXX"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="Votre adresse complète"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && renderPaymentStep()}

        {error && <div className="text-destructive text-sm text-center mt-4">{error}</div>}

        <div className="flex gap-2 mt-6">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Retour
            </Button>
          )}

          <Button
            type="button"
            onClick={step === 4 ? handleSubmit : handleNext}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === 4 ? "Inscription..." : "Suivant"}
              </>
            ) : step === 4 ? (
              "Finaliser l'inscription"
            ) : (
              "Suivant"
            )}
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button type="button" variant="link" onClick={onSwitchToLogin} className="text-primary hover:text-primary/80">
            Déjà un compte ? Connectez-vous
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
