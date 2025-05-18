"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkPlus, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Anime } from "@/types/anime"

interface AnimeCardProps {
  anime: Anime
  onAddToFavorites: () => void
}

export function AnimeCard({ anime, onAddToFavorites }: AnimeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[2/3]">
        <img
          src={anime.images?.jpg?.image_url || "/placeholder.svg?height=300&width=200"}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{anime.score || "N/A"}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-base mb-1 line-clamp-1">{anime.title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {anime.genres?.slice(0, 2).map((genre) => (
            <Badge key={genre.mal_id} variant="secondary" className="text-xs">
              {genre.name}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {anime.episodes ? `${anime.episodes} episodes` : "Unknown episodes"}
          </span>
          <Button size="sm" variant="ghost" onClick={onAddToFavorites}>
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
