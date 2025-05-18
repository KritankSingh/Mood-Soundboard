"use client"

import { useEffect, useRef } from "react"

interface MoodAnimationProps {
  mood: string
}

export default function MoodAnimation({ mood }: MoodAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animation configuration based on mood
  const moodConfigs = {
    happy: {
      particleCount: 50,
      colors: ["#FFD700", "#FFA500", "#FF4500"],
      speed: 2,
      size: { min: 5, max: 15 },
      shape: "circle",
    },
    sad: {
      particleCount: 30,
      colors: ["#4682B4", "#1E90FF", "#87CEEB"],
      speed: 0.5,
      size: { min: 3, max: 8 },
      shape: "drop",
    },
    angry: {
      particleCount: 70,
      colors: ["#FF0000", "#8B0000", "#FF4500"],
      speed: 3,
      size: { min: 2, max: 10 },
      shape: "triangle",
    },
    neutral: {
      particleCount: 40,
      colors: ["#808080", "#A9A9A9", "#D3D3D3"],
      speed: 1,
      size: { min: 4, max: 10 },
      shape: "square",
    },
    surprised: {
      particleCount: 60,
      colors: ["#9370DB", "#8A2BE2", "#BA55D3"],
      speed: 2.5,
      size: { min: 3, max: 12 },
      shape: "star",
    },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Get config for current mood
    const config = moodConfigs[mood as keyof typeof moodConfigs] || moodConfigs.neutral

    // Create particles
    const particles: any[] = []

    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        speedX: (Math.random() - 0.5) * config.speed,
        speedY: (Math.random() - 0.5) * config.speed,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    // Draw functions for different shapes
    const drawFunctions = {
      circle: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fill()
      },
      square: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      },
      triangle: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
        ctx.beginPath()
        ctx.moveTo(x, y - size / 2)
        ctx.lineTo(x + size / 2, y + size / 2)
        ctx.lineTo(x - size / 2, y + size / 2)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fill()
      },
      star: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
        ctx.beginPath()
        const spikes = 5
        const outerRadius = size
        const innerRadius = size / 2

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (Math.PI * i) / spikes
          ctx.lineTo(x + radius * Math.sin(angle), y + radius * Math.cos(angle))
        }

        ctx.closePath()
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fill()
      },
      drop: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
        ctx.beginPath()
        ctx.moveTo(x, y - size)
        ctx.bezierCurveTo(x + size, y - size, x + size, y, x, y + size)
        ctx.bezierCurveTo(x - size, y, x - size, y - size, x, y - size)
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fill()
      },
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Draw particle
        const drawFunction = drawFunctions[config.shape as keyof typeof drawFunctions] || drawFunctions.circle
        drawFunction(ctx, particle.x, particle.y, particle.size, particle.color, particle.opacity)
      })

      animationId = requestAnimationFrame(animate)
    }

    let animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [mood])

  return (
    <div className="w-full h-24 rounded-lg overflow-hidden border">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
