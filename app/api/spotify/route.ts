import { NextResponse } from "next/server"

// This is a mock API route that would normally connect to Spotify
// In a real app, you would need to authenticate with Spotify and use their API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get("genre")

  // Mock data based on genre
  const mockRecommendations = {
    "pop,happy": [
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
    "sad,acoustic": [
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
    "rock,metal": [
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
      {
        id: "a3",
        title: "Unleashed",
        artist: "Raw Energy",
        duration: 192,
        cover: "/placeholder.svg?height=80&width=80",
      },
    ],
    "ambient,chill": [
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
    "dance,electronic": [
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

  // Return mock data based on genre or default
  const tracks = mockRecommendations[genre as keyof typeof mockRecommendations] || mockRecommendations["ambient,chill"]

  return NextResponse.json({ tracks })
}
