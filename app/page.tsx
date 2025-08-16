"use client"

import { useState } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { AppHeader } from "@/components/layout/app-header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { AuthModal } from "@/components/auth/auth-modal"
import { HomePage } from "@/components/pages/home-page"
import { ProductsPage } from "@/components/pages/products-page"
import { SuppliersPage } from "@/components/pages/suppliers-page"
import { DiscussionsPage } from "@/components/pages/discussions-page"
import { MenuPage } from "@/components/pages/menu-page"
import { SupplierHub } from "@/components/supplier/supplier-hub"
import { AboutPage } from "@/components/pages/about-page"
import { ContactPage } from "@/components/pages/contact-page"
import { HelpPage } from "@/components/pages/help-page"
import { TermsPage } from "@/components/pages/terms-page"
import { PrivacyPage } from "@/components/pages/privacy-page"

export default function App() {
  const [activeTab, setActiveTab] = useState("home")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />
      case "products":
        return <ProductsPage />
      case "suppliers":
        return <SuppliersPage />
      case "supplier-hub":
        return <SupplierHub />
      case "discussions":
        return <DiscussionsPage />
      case "menu":
        return <MenuPage />
      case "about":
        return <AboutPage onBack={() => setActiveTab("home")} />
      case "contact":
        return <ContactPage onBack={() => setActiveTab("home")} />
      case "help":
        return <HelpPage onBack={() => setActiveTab("home")} />
      case "terms":
        return <TermsPage onBack={() => setActiveTab("home")} />
      case "privacy":
        return <PrivacyPage onBack={() => setActiveTab("home")} />
      case "cgv":
        return <TermsPage onBack={() => setActiveTab("home")} />
      default:
        return <HomePage onNavigate={setActiveTab} />
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader onSearchClick={() => setActiveTab("products")} />

        <main className="pb-20">{renderPage()}</main>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} onAuthClick={() => setShowAuthModal(true)} />

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </AuthProvider>
  )
}
