"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Mail, Phone, User } from "lucide-react"

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!identifier || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    try {
      await signIn(identifier, password)
    } catch (err: any) {
      setError(err.message || "Erreur de connexion")
    }
  }

  const getPlaceholder = () => {
    if (identifier.includes("@")) return "Email"
    if (identifier.match(/^\+?[\d\s-()]+$/)) return "Téléphone"
    return "Nom d'utilisateur"
  }

  const getIcon = () => {
    if (identifier.includes("@")) return <Mail className="h-4 w-4" />
    if (identifier.match(/^\+?[\d\s-()]+$/)) return <Phone className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">TradHub</CardTitle>
        <CardDescription>Connectez-vous à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email, Téléphone ou Nom d'utilisateur</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {getIcon()}
              </div>
              <Input
                id="identifier"
                type="text"
                placeholder={getPlaceholder()}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="text-destructive text-sm text-center">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary/80"
            >
              Pas de compte ? Inscrivez-vous
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
