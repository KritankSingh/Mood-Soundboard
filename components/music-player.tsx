"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, SkipForward, SkipBack, Music } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MusicPlayerProps {
  mood: string
  genre: string
  onTrackChange: (track: any) => void
  onPlayStateChange: (isPlaying: boolean) => void
}

// Mock data for tracks since we can't actually connect to Spotify without auth
const MOCK_TRACKS = {
  happy: [
    {
      id: "h1",
      title: "Happy Vibes",
      artist: "Mood Lifters",
      duration: 187,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "h2",
      title: "Sunshine Day",
      artist: "The Bright Side",
      duration: 203,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "h3",
      title: "Good Times",
      artist: "Positive Energy",
      duration: 176,
      cover: "/placeholder.svg?height=80&width=80",
    },
  ],
  sad: [
    {
      id: "s1",
      title: "Rainy Days",
      artist: "Melancholy Mood",
      duration: 224,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "s2",
      title: "Missing You",
      artist: "The Lonely Hearts",
      duration: 198,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "s3",
      title: "Blue Skies Fading",
      artist: "Downcast",
      duration: 215,
      cover: "/placeholder.svg?height=80&width=80",
    },
  ],
  angry: [
    {
      id: "a1",
      title: "Rage Against",
      artist: "The Furious",
      duration: 167,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "a2",
      title: "Breaking Point",
      artist: "Intensity",
      duration: 183,
      cover: "/placeholder.svg?height=80&width=80",
    },
    { id: "a3", title: "Unleashed", artist: "Raw Energy", duration: 192, cover: "/placeholder.svg?height=80&width=80" },
  ],
  neutral: [
    {
      id: "n1",
      title: "Calm Waters",
      artist: "Serenity Now",
      duration: 210,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "n2",
      title: "Balanced Mind",
      artist: "Equilibrium",
      duration: 195,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "n3",
      title: "Middle Ground",
      artist: "The Moderates",
      duration: 188,
      cover: "/placeholder.svg?height=80&width=80",
    },
  ],
  surprised: [
    {
      id: "su1",
      title: "Unexpected Turn",
      artist: "The Astonished",
      duration: 173,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "su2",
      title: "Wow Factor",
      artist: "Amazement",
      duration: 189,
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "su3",
      title: "Jaw Dropper",
      artist: "Shock & Awe",
      duration: 201,
      cover: "/placeholder.svg?height=80&width=80",
    },
  ],
}

export default function MusicPlayer({ mood, genre, onTrackChange, onPlayStateChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [tracks, setTracks] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Update tracks when mood changes
  useEffect(() => {
    // In a real app, this would fetch from Spotify API using the genre
    const moodTracks = MOCK_TRACKS[mood as keyof typeof MOCK_TRACKS] || MOCK_TRACKS.neutral
    setTracks(moodTracks)
    setCurrentTrackIndex(0)
    setProgress(0)

    // Show toast when mood changes
    toast({
      title: "Mood Changed",
      description: `Playing music for your ${mood} mood`,
    })

    // If already playing, restart with new tracks
    if (isPlaying) {
      setIsPlaying(false)
      setTimeout(() => setIsPlaying(true), 100)
    }
  }, [mood, toast])

  // Update parent components when track changes
  useEffect(() => {
    if (tracks.length > 0) {
      onTrackChange(tracks[currentTrackIndex])
    }
  }, [currentTrackIndex, tracks, onTrackChange])

  // Update parent when play state changes
  useEffect(() => {
    onPlayStateChange(isPlaying)
  }, [isPlaying, onPlayStateChange])

  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Handle track progress simulation
  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }

    if (isPlaying && tracks.length > 0) {
      const currentTrack = tracks[currentTrackIndex]
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            // Move to next track when current one finishes
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, currentTrackIndex, tracks])

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    setProgress(0)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    setProgress(0)
  }

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (tracks.length === 0) {
    return (
      <Card className="p-4 text-center">
        <Music className="mx-auto h-8 w-8 opacity-50" />
        <p className="mt-2">No tracks available for this mood</p>
      </Card>
    )
  }

  const currentTrack = tracks[currentTrackIndex]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.cover || "/placeholder.svg"}
          alt={currentTrack.title}
          className="w-20 h-20 rounded-md object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg line-clamp-1">{currentTrack.title}</h3>
          <p className="text-sm text-gray-500">{currentTrack.artist}</p>

          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button onClick={togglePlay} size="icon">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
