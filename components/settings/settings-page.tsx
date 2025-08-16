"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bell, Shield, Trash2, Key, Moon, Sun, Smartphone, Save, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SettingsPageProps {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    notifications: {
      messages: true,
      orders: true,
      marketing: false,
      push: true,
      email: true,
    },
    appearance: {
      theme: "dark",
      language: "fr",
      currency: "USD",
    },
    privacy: {
      showProfile: true,
      showLocation: true,
      showOnlineStatus: false,
      allowMessages: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
  })

  const [saving, setSaving] = useState(false)

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  const handleSecurityChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-instagram-gradient/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-instagram-gradient">Paramètres</h1>
      </div>

      {/* Notifications */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-instagram-gradient" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Messages</Label>
              <p className="text-sm text-muted-foreground">Recevoir des notifications pour les nouveaux messages</p>
            </div>
            <Switch
              checked={settings.notifications.messages}
              onCheckedChange={(value) => handleNotificationChange("messages", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Commandes</Label>
              <p className="text-sm text-muted-foreground">Notifications sur le statut des commandes</p>
            </div>
            <Switch
              checked={settings.notifications.orders}
              onCheckedChange={(value) => handleNotificationChange("orders", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Notifications push</Label>
              <p className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(value) => handleNotificationChange("push", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Emails</Label>
              <p className="text-sm text-muted-foreground">Recevoir des emails de notification</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(value) => handleNotificationChange("email", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Marketing</Label>
              <p className="text-sm text-muted-foreground">Recevoir des offres et promotions</p>
            </div>
            <Switch
              checked={settings.notifications.marketing}
              onCheckedChange={(value) => handleNotificationChange("marketing", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-instagram-gradient" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="font-medium">Thème</Label>
            <Select
              value={settings.appearance.theme}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, theme: value } }))
              }
            >
              <SelectTrigger className="focus:ring-instagram-gradient/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Clair
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Langue</Label>
            <Select
              value={settings.appearance.language}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, language: value } }))
              }
            >
              <SelectTrigger className="focus:ring-instagram-gradient/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="ar">🇸🇦 العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Devise préférée</Label>
            <Select
              value={settings.appearance.currency}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, currency: value } }))
              }
            >
              <SelectTrigger className="focus:ring-instagram-gradient/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem value="USD">💵 USD ($)</SelectItem>
                <SelectItem value="EUR">💶 EUR (€)</SelectItem>
                <SelectItem value="CDF">🇨🇩 CDF (FC)</SelectItem>
                <SelectItem value="XAF">🇨🇲 XAF (FCFA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-instagram-gradient" />
            Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Profil public</Label>
              <p className="text-sm text-muted-foreground">Permettre aux autres de voir votre profil</p>
            </div>
            <Switch
              checked={settings.privacy.showProfile}
              onCheckedChange={(value) => handlePrivacyChange("showProfile", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Localisation visible</Label>
              <p className="text-sm text-muted-foreground">Afficher votre ville dans votre profil</p>
            </div>
            <Switch
              checked={settings.privacy.showLocation}
              onCheckedChange={(value) => handlePrivacyChange("showLocation", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Statut en ligne</Label>
              <p className="text-sm text-muted-foreground">Montrer quand vous êtes en ligne</p>
            </div>
            <Switch
              checked={settings.privacy.showOnlineStatus}
              onCheckedChange={(value) => handlePrivacyChange("showOnlineStatus", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Messages autorisés</Label>
              <p className="text-sm text-muted-foreground">Permettre aux autres de vous envoyer des messages</p>
            </div>
            <Switch
              checked={settings.privacy.allowMessages}
              onCheckedChange={(value) => handlePrivacyChange("allowMessages", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-instagram-gradient" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <Switch
              checked={settings.security.twoFactor}
              onCheckedChange={(value) => handleSecurityChange("twoFactor", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Alertes de connexion</Label>
              <p className="text-sm text-muted-foreground">Être notifié des nouvelles connexions</p>
            </div>
            <Switch
              checked={settings.security.loginAlerts}
              onCheckedChange={(value) => handleSecurityChange("loginAlerts", value)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start hover:bg-instagram-gradient/10 bg-transparent">
              <Key className="h-4 w-4 mr-2" />
              Changer le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card className="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zone dangereuse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Désactiver le compte
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer définitivement le compte
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            La suppression du compte est irréversible. Toutes vos données seront perdues définitivement.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-instagram-gradient hover:bg-instagram-gradient/90"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
      </Button>
    </div>
  )
}
