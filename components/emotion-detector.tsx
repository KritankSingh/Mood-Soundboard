"use client"

import { useRef, useEffect, useState } from "react"
import * as faceapi from "face-api.js"

interface EmotionDetectorProps {
  onMoodDetected: (mood: string) => void
  isActive: boolean
}

export default function EmotionDetector({ onMoodDetected, isActive }: EmotionDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
        console.log("Models loaded successfully")
      } catch (error) {
        console.error("Error loading models:", error)
      }
    }

    loadModels()

    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Start/stop webcam based on isActive prop
  useEffect(() => {
    if (isActive && modelsLoaded) {
      startWebcam()
    } else if (!isActive && stream) {
      stopWebcam()
    }

    return () => {
      if (stream) {
        stopWebcam()
      }
    }
  }, [isActive, modelsLoaded])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setStream(stream)
    } catch (error) {
      console.error("Error accessing webcam:", error)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  // Detect emotions when video is playing
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || !isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current

    video.addEventListener("play", () => {
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      }

      faceapi.matchDimensions(canvas, displaySize)

      // Run detection every 100ms
      const interval = setInterval(async () => {
        if (!isActive) {
          clearInterval(interval)
          return
        }

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()

        if (detections && detections.length > 0) {
          const expressions = detections[0].expressions

          // Find the expression with highest probability
          let highestExpression = "neutral"
          let highestValue = 0

          Object.entries(expressions).forEach(([expression, value]) => {
            if (value > highestValue) {
              highestValue = value
              highestExpression = expression
            }
          })

          // Map face-api expressions to our mood categories
          let mood
          switch (highestExpression) {
            case "happy":
              mood = "happy"
              break
            case "sad":
            case "fearful":
              mood = "sad"
              break
            case "angry":
            case "disgusted":
              mood = "angry"
              break
            case "surprised":
              mood = "surprised"
              break
            default:
              mood = "neutral"
          }

          onMoodDetected(mood)

          // Draw detection results on canvas
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
          faceapi.draw.drawDetections(canvas, resizedDetections)
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }
      }, 100)

      return () => clearInterval(interval)
    })
  }, [modelsLoaded, isActive, onMoodDetected])

  return (
    <>
      <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!modelsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <p>Loading emotion detection models...</p>
        </div>
      )}
    </>
  )
}
