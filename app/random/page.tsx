"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { BookmarkPlus, RefreshCw, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import type { Anime } from "@/types/anime"

export default function RandomPage() {
  const [randomAnime, setRandomAnime] = useState<Anime | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const { addFavorite } = useFavorites()

  const getRandomAnime = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://api.jikan.moe/v4/random/anime")
      const data = await response.json()
      setRandomAnime(data.data)
    } catch (error) {
      console.error("Error fetching random anime:", error)
      toast({
        title: "Error",
        description: "Failed to fetch random anime. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToFavorites = () => {
    if (randomAnime) {
      addFavorite(randomAnime)
      toast({
        title: "Added to favorites",
        description: `${randomAnime.title} has been added to your favorites.`,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Random Anime Recommendation</h1>

        <div className="mb-8 text-center">
          <Button onClick={getRandomAnime} disabled={isLoading} size="lg" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Get Random Anime
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-[400px] w-full" />
              </div>
              <div className="md:col-span-2 p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-10 w-40 mt-6" />
              </div>
            </div>
          </Card>
        ) : randomAnime ? (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img
                  src={randomAnime.images?.jpg?.large_image_url || "/placeholder.svg?height=400&width=300"}
                  alt={randomAnime.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 p-6">
                <h2 className="text-2xl font-bold mb-2">{randomAnime.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{randomAnime.score || "N/A"}</span>
                  </div>
                  <span>•</span>
                  <span>{randomAnime.episodes ? `${randomAnime.episodes} episodes` : "Unknown episodes"}</span>
                  <span>•</span>
                  <span>{randomAnime.year || "Unknown year"}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {randomAnime.genres?.map((genre) => (
                    <Badge key={genre.mal_id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 line-clamp-4">{randomAnime.synopsis || "No description available."}</p>

                <Button onClick={handleAddToFavorites} className="gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-lg mb-4">Click the button above to get a random anime recommendation.</p>
            <p className="text-sm text-gray-500">Discover something new and exciting!</p>
          </div>
        )}
      </div>
    </div>
  )
}
