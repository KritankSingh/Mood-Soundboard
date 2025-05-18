"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Tv, Users, Palette, BookmarkPlus } from "lucide-react"
import { AnimeCard } from "@/components/anime/anime-card"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import type { Anime } from "@/types/anime"

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const { addFavorite } = useFavorites()

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=4")
        const data = await response.json()
        setTrendingAnime(data.data || [])
      } catch (error) {
        console.error("Error fetching trending anime:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingAnime()
  }, [])

  const handleAddToFavorites = (anime: Anime) => {
    addFavorite(anime)
    toast({
      title: "Added to favorites",
      description: `${anime.title} has been added to your favorites.`,
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover Anime & Create Your Avatar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore anime by genre, get random recommendations, and create your own custom anime-style avatar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mb-4">
                <Tv className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Explore Anime</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse anime by genre and discover new series to watch.
              </p>
              <Link href="/explore">
                <Button variant="outline" className="w-full">
                  Browse Genres
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-800">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create Avatar</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Design your own anime-style avatar with customizable features.
              </p>
              <Link href="/avatar">
                <Button variant="outline" className="w-full">
                  Create Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                <BookmarkPlus className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Favorites</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create a collection of your favorite anime series.
              </p>
              <Link href="/favorites">
                <Button variant="outline" className="w-full">
                  View Favorites
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Anime</h2>
          <Link href="/explore">
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative aspect-[2/3]">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} onAddToFavorites={() => handleAddToFavorites(anime)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Can't Decide What to Watch?</h2>
              <p className="text-white/80 mb-4">
                Get a random anime recommendation and discover your next favorite series.
              </p>
              <Link href="/random">
                <Button variant="secondary" size="lg">
                  Get Random Recommendation
                </Button>
              </Link>
            </div>
            <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="h-16 w-16 text-white" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
