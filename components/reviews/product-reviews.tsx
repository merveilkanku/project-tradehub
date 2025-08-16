"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Flag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  timestamp: string
  helpful: number
  notHelpful: number
  verified: boolean
  images?: string[]
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Marie Kabongo",
    userAvatar: "/avatar-marie.png",
    rating: 5,
    title: "Excellent produit !",
    comment:
      "Très satisfaite de cet achat. La qualité est au rendez-vous et la livraison a été rapide. Je recommande vivement ce vendeur.",
    timestamp: "2024-01-10T14:30:00Z",
    helpful: 12,
    notHelpful: 1,
    verified: true,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jean Mukendi",
    userAvatar: "/stylized-man-avatar.png",
    rating: 4,
    title: "Bon rapport qualité-prix",
    comment: "Produit conforme à la description. Quelques petits défauts mais rien de grave. Service client réactif.",
    timestamp: "2024-01-08T09:15:00Z",
    helpful: 8,
    notHelpful: 2,
    verified: true,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Patrick Mwamba",
    userAvatar: "/stylized-woman-denim.png",
    rating: 3,
    title: "Correct sans plus",
    comment: "Le produit fait le travail mais j'attendais mieux pour ce prix. Livraison un peu lente.",
    timestamp: "2024-01-05T16:45:00Z",
    helpful: 3,
    notHelpful: 5,
    verified: false,
  },
]

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
  })
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful" | "rating">("newest")

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : interactive
                  ? "text-muted-foreground hover:text-yellow-400 cursor-pointer"
                  : "text-muted-foreground"
            } ${interactive ? "transition-colors" : ""}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmitReview = () => {
    if (!user || newReview.rating === 0 || !newReview.comment.trim()) return

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.profile?.full_name || "Utilisateur",
      userAvatar: user.profile?.avatar_url || undefined,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      timestamp: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
      verified: true,
    }

    setReviews((prev) => [review, ...prev])
    setNewReview({ rating: 0, title: "", comment: "" })
    setShowReviewForm(false)
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case "helpful":
        return b.helpful - a.helpful
      case "rating":
        return b.rating - a.rating
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  const distribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avis clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-instagram-gradient">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mt-1">{renderStars(Math.round(averageRating))}</div>
              <div className="text-sm text-muted-foreground mt-1">{totalReviews} avis</div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-instagram-gradient h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${totalReviews > 0 ? (distribution[rating as keyof typeof distribution] / totalReviews) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {distribution[rating as keyof typeof distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <div className="pt-4 border-t border-border">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-instagram-gradient hover:bg-instagram-gradient/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Laisser un avis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Votre avis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Note</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Titre (optionnel)</label>
              <input
                type="text"
                placeholder="Résumez votre expérience"
                value={newReview.title}
                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-instagram-gradient/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Commentaire</label>
              <Textarea
                placeholder="Partagez votre expérience avec ce produit..."
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="focus:ring-instagram-gradient/20"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
                className="bg-instagram-gradient hover:bg-instagram-gradient/90"
              >
                Publier l'avis
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)} className="bg-transparent">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Avis ({reviews.length})</CardTitle>
            <div className="flex gap-2">
              {[
                { key: "newest", label: "Plus récents" },
                { key: "helpful", label: "Plus utiles" },
                { key: "rating", label: "Mieux notés" },
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.key as any)}
                  className={`text-xs ${
                    sortBy === option.key ? "bg-instagram-gradient text-white" : "hover:bg-instagram-gradient/10"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Achat vérifié
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{formatTimestamp(review.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    {review.title && <span className="font-medium text-sm">{review.title}</span>}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-instagram-gradient/10">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Utile ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-instagram-gradient/10">
                      <ThumbsDown className="h-3 w-3 mr-1" />({review.notHelpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-destructive/10 text-muted-foreground">
                      <Flag className="h-3 w-3 mr-1" />
                      Signaler
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
