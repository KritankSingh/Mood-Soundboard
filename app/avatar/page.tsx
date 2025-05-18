"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Shuffle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AvatarCanvas } from "@/components/avatar/avatar-canvas"

// Avatar customization options
const hairStyles = ["short", "medium", "long", "ponytail", "twintails"]
const hairColors = ["black", "#4B3621", "#D4B499", "#FBCEB1", "#FFD700", "#8A2BE2", "#FF69B4", "#00BFFF"]
const eyeStyles = ["round", "almond", "narrow", "wide"]
const eyeColors = ["#000000", "#654321", "#0000FF", "#00FF00", "#800080", "#FF0000"]
const mouthStyles = ["smile", "neutral", "smirk"]
const skinTones = ["#FFDBAC", "#F1C27D", "#E0AC69", "#C68642", "#8D5524"]
const accessories = ["none", "glasses", "eyepatch", "mask", "headphones"]

export default function AvatarPage() {
  const [avatarOptions, setAvatarOptions] = useState({
    hairStyle: "medium",
    hairColor: "#4B3621",
    eyeStyle: "round",
    eyeColor: "#000000",
    mouthStyle: "smile",
    skinTone: "#FFDBAC",
    accessory: "none",
    blushIntensity: 0,
  })
  const { toast } = useToast()

  const updateAvatarOption = (option: string, value: string | number) => {
    setAvatarOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  const randomizeAvatar = () => {
    setAvatarOptions({
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      mouthStyle: mouthStyles[Math.floor(Math.random() * mouthStyles.length)],
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
      blushIntensity: Math.floor(Math.random() * 100),
    })

    toast({
      title: "Avatar Randomized",
      description: "Your avatar has been randomly customized!",
    })
  }

  const downloadAvatar = () => {
    const canvas = document.getElementById("avatar-canvas") as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement("a")
      link.download = "anime-avatar.png"
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast({
        title: "Avatar Downloaded",
        description: "Your custom avatar has been downloaded!",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Anime Avatar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="hair" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="hair">Hair</TabsTrigger>
                  <TabsTrigger value="face">Face</TabsTrigger>
                  <TabsTrigger value="eyes">Eyes</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>

                <TabsContent value="hair" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hair Style</Label>
                    <Select
                      value={avatarOptions.hairStyle}
                      onValueChange={(value) => updateAvatarOption("hairStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hair style" />
                      </SelectTrigger>
                      <SelectContent>
                        {hairStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hair Color</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {hairColors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatarOptions.hairColor === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateAvatarOption("hairColor", color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="face" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Skin Tone</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {skinTones.map((tone) => (
                        <button
                          key={tone}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatarOptions.skinTone === tone ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: tone }}
                          onClick={() => updateAvatarOption("skinTone", tone)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mouth Style</Label>
                    <RadioGroup
                      value={avatarOptions.mouthStyle}
                      onValueChange={(value) => updateAvatarOption("mouthStyle", value)}
                      className="flex gap-4"
                    >
                      {mouthStyles.map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <RadioGroupItem value={style} id={`mouth-${style}`} />
                          <Label htmlFor={`mouth-${style}`}>{style.charAt(0).toUpperCase() + style.slice(1)}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Blush Intensity: {avatarOptions.blushIntensity}%</Label>
                    <Slider
                      value={[avatarOptions.blushIntensity as number]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateAvatarOption("blushIntensity", value[0])}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="eyes" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Eye Style</Label>
                    <Select
                      value={avatarOptions.eyeStyle}
                      onValueChange={(value) => updateAvatarOption("eyeStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select eye style" />
                      </SelectTrigger>
                      <SelectContent>
                        {eyeStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Eye Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {eyeColors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatarOptions.eyeColor === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateAvatarOption("eyeColor", color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="extras" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Accessories</Label>
                    <Select
                      value={avatarOptions.accessory}
                      onValueChange={(value) => updateAvatarOption("accessory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accessory" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessories.map((accessory) => (
                          <SelectItem key={accessory} value={accessory}>
                            {accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 mt-6">
                <Button onClick={randomizeAvatar} variant="outline" className="flex-1 gap-2">
                  <Shuffle className="h-4 w-4" />
                  Randomize
                </Button>
                <Button onClick={downloadAvatar} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <AvatarCanvas options={avatarOptions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
