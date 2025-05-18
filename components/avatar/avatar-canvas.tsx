"use client"

import { useEffect, useRef } from "react"

interface AvatarOptions {
  hairStyle: string
  hairColor: string
  eyeStyle: string
  eyeColor: string
  mouthStyle: string
  skinTone: string
  accessory: string
  blushIntensity: number
}

interface AvatarCanvasProps {
  options: AvatarOptions
}

export function AvatarCanvas({ options }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 400
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw face
    drawFace(ctx, options)
  }, [options])

  return <canvas ref={canvasRef} id="avatar-canvas" className="w-full h-auto" />
}

function drawFace(ctx: CanvasRenderingContext2D, options: AvatarOptions) {
  const { hairStyle, hairColor, eyeStyle, eyeColor, mouthStyle, skinTone, accessory, blushIntensity } = options
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  const centerX = width / 2
  const centerY = height / 2

  // Draw head
  ctx.fillStyle = skinTone
  ctx.beginPath()
  ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2)
  ctx.fill()

  // Draw hair based on style
  drawHair(ctx, hairStyle, hairColor, centerX, centerY, width, height)

  // Draw eyes based on style
  drawEyes(ctx, eyeStyle, eyeColor, centerX, centerY, width)

  // Draw mouth based on style
  drawMouth(ctx, mouthStyle, centerX, centerY, width)

  // Draw blush if intensity > 0
  if (blushIntensity > 0) {
    const blushOpacity = blushIntensity / 100
    ctx.fillStyle = `rgba(255, 150, 150, ${blushOpacity})`

    // Left cheek
    ctx.beginPath()
    ctx.arc(centerX - width * 0.15, centerY + height * 0.05, width * 0.08, 0, Math.PI * 2)
    ctx.fill()

    // Right cheek
    ctx.beginPath()
    ctx.arc(centerX + width * 0.15, centerY + height * 0.05, width * 0.08, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw accessory if not "none"
  if (accessory !== "none") {
    drawAccessory(ctx, accessory, centerX, centerY, width, height)
  }
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  style: string,
  color: string,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
) {
  ctx.fillStyle = color

  switch (style) {
    case "short":
      // Short hair
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI * 2)
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2, true)
      ctx.fill()

      // Top hair
      ctx.beginPath()
      ctx.arc(centerX, centerY - height * 0.05, width * 0.36, Math.PI, Math.PI * 2)
      ctx.fill()
      break

    case "medium":
      // Medium length hair
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI * 2)
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2, true)
      ctx.fill()

      // Top and side hair
      ctx.beginPath()
      ctx.moveTo(centerX - width * 0.36, centerY)
      ctx.quadraticCurveTo(
        centerX - width * 0.4,
        centerY + height * 0.3,
        centerX - width * 0.25,
        centerY + height * 0.4,
      )
      ctx.lineTo(centerX + width * 0.25, centerY + height * 0.4)
      ctx.quadraticCurveTo(centerX + width * 0.4, centerY + height * 0.3, centerX + width * 0.36, centerY)
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI, true)
      ctx.fill()
      break

    case "long":
      // Long hair
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI * 2)
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2, true)
      ctx.fill()

      // Long flowing hair
      ctx.beginPath()
      ctx.moveTo(centerX - width * 0.36, centerY)
      ctx.quadraticCurveTo(
        centerX - width * 0.45,
        centerY + height * 0.3,
        centerX - width * 0.3,
        centerY + height * 0.5,
      )
      ctx.lineTo(centerX + width * 0.3, centerY + height * 0.5)
      ctx.quadraticCurveTo(centerX + width * 0.45, centerY + height * 0.3, centerX + width * 0.36, centerY)
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI, true)
      ctx.fill()
      break

    case "ponytail":
      // Base hair
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI * 2)
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2, true)
      ctx.fill()

      // Top hair
      ctx.beginPath()
      ctx.arc(centerX, centerY - height * 0.05, width * 0.36, Math.PI, Math.PI * 2)
      ctx.fill()

      // Ponytail
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - height * 0.2)
      ctx.quadraticCurveTo(centerX + width * 0.2, centerY - height * 0.1, centerX + width * 0.3, centerY + height * 0.3)
      ctx.quadraticCurveTo(
        centerX + width * 0.25,
        centerY + height * 0.35,
        centerX + width * 0.2,
        centerY + height * 0.3,
      )
      ctx.quadraticCurveTo(centerX + width * 0.1, centerY - height * 0.05, centerX, centerY - height * 0.15)
      ctx.fill()

      // Hair tie
      ctx.fillStyle = "#333"
      ctx.beginPath()
      ctx.ellipse(
        centerX + width * 0.1,
        centerY - height * 0.05,
        width * 0.03,
        width * 0.06,
        Math.PI / 4,
        0,
        Math.PI * 2,
      )
      ctx.fill()
      break

    case "twintails":
      // Base hair
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX, centerY, width * 0.36, 0, Math.PI * 2)
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2, true)
      ctx.fill()

      // Top hair
      ctx.beginPath()
      ctx.arc(centerX, centerY - height * 0.05, width * 0.36, Math.PI, Math.PI * 2)
      ctx.fill()

      // Left twintail
      ctx.beginPath()
      ctx.moveTo(centerX - width * 0.2, centerY - height * 0.15)
      ctx.quadraticCurveTo(centerX - width * 0.35, centerY, centerX - width * 0.3, centerY + height * 0.3)
      ctx.quadraticCurveTo(
        centerX - width * 0.35,
        centerY + height * 0.35,
        centerX - width * 0.4,
        centerY + height * 0.3,
      )
      ctx.quadraticCurveTo(centerX - width * 0.45, centerY, centerX - width * 0.25, centerY - height * 0.15)
      ctx.fill()

      // Right twintail
      ctx.beginPath()
      ctx.moveTo(centerX + width * 0.2, centerY - height * 0.15)
      ctx.quadraticCurveTo(centerX + width * 0.35, centerY, centerX + width * 0.3, centerY + height * 0.3)
      ctx.quadraticCurveTo(
        centerX + width * 0.35,
        centerY + height * 0.35,
        centerX + width * 0.4,
        centerY + height * 0.3,
      )
      ctx.quadraticCurveTo(centerX + width * 0.45, centerY, centerX + width * 0.25, centerY - height * 0.15)
      ctx.fill()

      // Left hair tie
      ctx.fillStyle = "#333"
      ctx.beginPath()
      ctx.ellipse(
        centerX - width * 0.25,
        centerY - height * 0.05,
        width * 0.03,
        width * 0.06,
        Math.PI / 4,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Right hair tie
      ctx.beginPath()
      ctx.ellipse(
        centerX + width * 0.25,
        centerY - height * 0.05,
        width * 0.03,
        width * 0.06,
        -Math.PI / 4,
        0,
        Math.PI * 2,
      )
      ctx.fill()
      break
  }
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  style: string,
  color: string,
  centerX: number,
  centerY: number,
  width: number,
) {
  const eyeSpacing = width * 0.12
  const eyeY = centerY - width * 0.05

  switch (style) {
    case "round":
      // Left eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.06, width * 0.08, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.03, 0, Math.PI * 2)
      ctx.fill()

      // Left pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.015, 0, Math.PI * 2)
      ctx.fill()

      // Left highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing + width * 0.015, eyeY - width * 0.01, width * 0.008, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.06, width * 0.08, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.03, 0, Math.PI * 2)
      ctx.fill()

      // Right pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.015, 0, Math.PI * 2)
      ctx.fill()

      // Right highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing + width * 0.015, eyeY - width * 0.01, width * 0.008, 0, Math.PI * 2)
      ctx.fill()
      break

    case "almond":
      // Left eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.07, width * 0.05, Math.PI / 6, 0, Math.PI * 2)
      ctx.fill()

      // Left iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.025, 0, Math.PI * 2)
      ctx.fill()

      // Left pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.012, 0, Math.PI * 2)
      ctx.fill()

      // Left highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing + width * 0.01, eyeY - width * 0.005, width * 0.006, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.07, width * 0.05, -Math.PI / 6, 0, Math.PI * 2)
      ctx.fill()

      // Right iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.025, 0, Math.PI * 2)
      ctx.fill()

      // Right pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.012, 0, Math.PI * 2)
      ctx.fill()

      // Right highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing + width * 0.01, eyeY - width * 0.005, width * 0.006, 0, Math.PI * 2)
      ctx.fill()
      break

    case "narrow":
      // Left eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.08, width * 0.03, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.04, width * 0.02, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.02, width * 0.01, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.08, width * 0.03, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.04, width * 0.02, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.02, width * 0.01, 0, 0, Math.PI * 2)
      ctx.fill()
      break

    case "wide":
      // Left eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX - eyeSpacing, eyeY, width * 0.08, width * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()

      // Left iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.04, 0, Math.PI * 2)
      ctx.fill()

      // Left pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing, eyeY, width * 0.02, 0, Math.PI * 2)
      ctx.fill()

      // Left highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX - eyeSpacing + width * 0.02, eyeY - width * 0.01, width * 0.01, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.ellipse(centerX + eyeSpacing, eyeY, width * 0.08, width * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right iris
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.04, 0, Math.PI * 2)
      ctx.fill()

      // Right pupil
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing, eyeY, width * 0.02, 0, Math.PI * 2)
      ctx.fill()

      // Right highlight
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(centerX + eyeSpacing + width * 0.02, eyeY - width * 0.01, width * 0.01, 0, Math.PI * 2)
      ctx.fill()
      break
  }

  // Draw eyebrows
  ctx.fillStyle = "#333"

  // Left eyebrow
  ctx.beginPath()
  ctx.ellipse(centerX - eyeSpacing, eyeY - width * 0.08, width * 0.08, width * 0.02, Math.PI / 12, 0, Math.PI * 2)
  ctx.fill()

  // Right eyebrow
  ctx.beginPath()
  ctx.ellipse(centerX + eyeSpacing, eyeY - width * 0.08, width * 0.08, width * 0.02, -Math.PI / 12, 0, Math.PI * 2)
  ctx.fill()
}

function drawMouth(ctx: CanvasRenderingContext2D, style: string, centerX: number, centerY: number, width: number) {
  const mouthY = centerY + width * 0.15

  switch (style) {
    case "smile":
      ctx.strokeStyle = "#000"
      ctx.lineWidth = width * 0.01
      ctx.beginPath()
      ctx.arc(centerX, mouthY, width * 0.12, 0.1, Math.PI - 0.1)
      ctx.stroke()
      break

    case "neutral":
      ctx.strokeStyle = "#000"
      ctx.lineWidth = width * 0.01
      ctx.beginPath()
      ctx.moveTo(centerX - width * 0.1, mouthY)
      ctx.lineTo(centerX + width * 0.1, mouthY)
      ctx.stroke()
      break

    case "smirk":
      ctx.strokeStyle = "#000"
      ctx.lineWidth = width * 0.01
      ctx.beginPath()
      ctx.moveTo(centerX - width * 0.1, mouthY)
      ctx.quadraticCurveTo(centerX, mouthY - width * 0.05, centerX + width * 0.1, mouthY - width * 0.02)
      ctx.stroke()
      break
  }
}

function drawAccessory(
  ctx: CanvasRenderingContext2D, 
  accessory: string, 
  centerX: number, 
  centerY: number, 
  width: number, 
  height: number
) {
  const eyeY = centerY - width * 0.05
  const eyeSpacing = width * 0.12
  
  switch (accessory) {
    case "glasses":
      ctx.strokeStyle = "#000"
      ctx.lineWidth = width * 0.008
      
      // Left lens
      ctx.beginPath()
      ctx.ellipse(
        centerX - eyeSpacing, 
        eyeY, 
        width * 0.09, 
        width * 0.11, 
        0, 
        0, 
        Math.PI * 2\
