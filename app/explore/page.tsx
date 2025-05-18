"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AnimeCard } from "@/components/anime/anime-card"
import { useFavorites } from "@/hooks/use-favorites"
import type { Anime } from "@/types/anime"

const genres = [
  { id: "1", name: "Action" },
  { id: "2", name: "Adventure" },
  { id: "4", name: "Comedy" },
  { id: "8", name: "Drama" },
  { id: "10", name: "Fantasy" },
  { id: "14", name: "Horror" },
  { id: "22", name: "Romance" },
  { id: "24", name: "Sci-Fi" },
  { id: "36", name: "Slice of Life" },
  { id: "37", name: "Supernatural" },
]

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string>("1")
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const { toast } = useToast()
  const { addFavorite } = useFavorites()

  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${selectedGenre}&page=${page}&limit=12`)
        const data = await response.json()
        setAnimeList(data.data || [])
      } catch (error) {
        console.error("Error fetching anime:", error)
        toast({
          title: "Error",
          description: "Failed to fetch anime. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnime()
  }, [selectedGenre, page, toast])

  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId)
    setPage(1)
  }

  const handleAddToFavorites = (anime: Anime) => {
    addFavorite(anime)
    toast({
      title: "Added to favorites",
      description: `${anime.title} has been added to your favorites.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Anime</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleGenreChange(genre.id)}
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{genres.find((g) => g.id === selectedGenre)?.name} Anime</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12)
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
          <>
            {animeList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} onAddToFavorites={() => handleAddToFavorites(anime)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No anime found for this genre.</p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={animeList.length < 12 || isLoading}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
