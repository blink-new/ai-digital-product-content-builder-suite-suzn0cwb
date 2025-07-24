import { useState, useRef } from 'react'
import { Image, Type, Download, Shuffle, Sparkles, Hash, Upload, Wand2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Slider } from '../ui/slider'
import { blink } from '../../blink/client'
import { toast } from '../../hooks/use-toast'

interface MemeTemplate {
  id: string
  name: string
  description: string
  textPositions: { top: boolean; bottom: boolean; center: boolean }
  trending: boolean
}

const memeTemplates: MemeTemplate[] = [
  {
    id: 'drake-pointing',
    name: 'Drake Pointing',
    description: 'Classic preference meme format',
    textPositions: { top: true, bottom: true, center: false },
    trending: true
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    description: 'Popular choice/temptation format',
    textPositions: { top: false, bottom: false, center: true },
    trending: true
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    description: 'Argument/reaction format',
    textPositions: { top: true, bottom: true, center: false },
    trending: false
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    description: 'Progressive intelligence levels',
    textPositions: { top: false, bottom: false, center: true },
    trending: true
  },
  {
    id: 'this-is-fine',
    name: 'This is Fine',
    description: 'Everything is chaos but staying calm',
    textPositions: { top: true, bottom: false, center: false },
    trending: false
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    description: 'Controversial opinion format',
    textPositions: { top: false, bottom: true, center: false },
    trending: true
  }
]

const viralContentTypes = [
  { id: 'meme', name: 'Meme', icon: '😂' },
  { id: 'quote', name: 'Inspirational Quote', icon: '✨' },
  { id: 'tip', name: 'Quick Tip', icon: '💡' },
  { id: 'fact', name: 'Fun Fact', icon: '🤓' },
  { id: 'question', name: 'Engaging Question', icon: '❓' },
  { id: 'carousel', name: 'Carousel Post', icon: '📱' }
]

export function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [contentType, setContentType] = useState('meme')
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [centerText, setCenterText] = useState('')
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [fontSize, setFontSize] = useState([40])
  const [fontColor, setFontColor] = useState('#FFFFFF')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [niche, setNiche] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const { publicUrl } = await blink.storage.upload(file, `memes/${file.name}`, { upsert: true })
      setCustomImage(publicUrl)
      toast({
        title: "Image uploaded!",
        description: "Your custom image is ready to use."
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    }
  }

  const generateViralContent = async () => {
    setIsGenerating(true)
    try {
      let prompt = ''
      
      switch (contentType) {
        case 'meme':
          prompt = `Generate viral meme text for ${selectedTemplate?.name || 'a meme'} format. Topic: ${niche || 'general humor'}. Make it relatable, funny, and shareable. Include top text and bottom text.`
          break
        case 'quote':
          prompt = `Create an inspirational quote about ${niche || 'success and motivation'}. Make it powerful, memorable, and shareable on social media.`
          break
        case 'tip':
          prompt = `Generate a quick, actionable tip about ${niche || 'productivity'}. Make it valuable and easy to implement.`
          break
        case 'fact':
          prompt = `Share an interesting, surprising fact about ${niche || 'general knowledge'}. Make it engaging and conversation-starting.`
          break
        case 'question':
          prompt = `Create an engaging question about ${niche || 'life experiences'} that will get people commenting and sharing their thoughts.`
          break
        case 'carousel':
          prompt = `Generate 5 slides for a carousel post about ${niche || 'personal development'}. Each slide should have a catchy title and brief description.`
          break
      }

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini'
      })

      // Parse the response and extract text content
      if (contentType === 'meme') {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length >= 2) {
          setTopText(lines[0].replace(/^(Top text:|Top:)/i, '').trim())
          setBottomText(lines[1].replace(/^(Bottom text:|Bottom:)/i, '').trim())
        } else {
          setTopText(text.substring(0, text.length / 2))
          setBottomText(text.substring(text.length / 2))
        }
      } else {
        setCenterText(text)
      }

      // Generate hashtags
      const hashtagResponse = await blink.ai.generateText({
        prompt: `Generate 10 trending hashtags for this ${contentType} content: "${text}". Focus on ${niche || 'general'} niche. Return as comma-separated list.`,
        model: 'gpt-4o-mini'
      })

      const generatedHashtags = hashtagResponse.text
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0)
        .slice(0, 10)

      setHashtags(generatedHashtags)

      // Generate caption
      const captionResponse = await blink.ai.generateText({
        prompt: `Write an engaging social media caption for this ${contentType}: "${text}". Include emojis, call-to-action, and make it shareable. Keep it under 150 characters.`,
        model: 'gpt-4o-mini'
      })

      setCaption(captionResponse.text)

      toast({
        title: "Content generated!",
        description: "Your viral content is ready to customize."
      })
    } catch (error) {
      console.error('Error generating content:', error)
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMemeImage = async () => {
    if (!selectedTemplate && !customImage) {
      toast({
        title: "No template selected",
        description: "Please select a meme template or upload a custom image.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      let imagePrompt = ''
      
      if (customImage) {
        // Use the custom image as base
        const { data } = await blink.ai.modifyImage({
          images: [customImage],
          prompt: `Add meme text overlay: "${topText}" at the top and "${bottomText}" at the bottom. Use bold white text with black outline. Professional meme format.`,
          quality: 'high',
          n: 1
        })
        setGeneratedMeme(data[0].url)
      } else {
        // Generate based on template
        imagePrompt = `Create a ${selectedTemplate?.name} meme image with text overlay. Top text: "${topText}", Bottom text: "${bottomText}". High quality, viral meme format, bold white text with black outline.`
        
        const { data } = await blink.ai.generateImage({
          prompt: imagePrompt,
          size: '1024x1024',
          quality: 'high',
          n: 1
        })
        setGeneratedMeme(data[0].url)
      }

      toast({
        title: "Meme created!",
        description: "Your viral meme is ready to download and share."
      })
    } catch (error) {
      console.error('Error generating meme:', error)
      toast({
        title: "Generation failed",
        description: "Failed to create meme. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadMeme = () => {
    if (!generatedMeme) return

    const link = document.createElement('a')
    link.href = generatedMeme
    link.download = `meme-${Date.now()}.png`
    link.click()
  }

  const getRandomTemplate = () => {
    const randomTemplate = memeTemplates[Math.floor(Math.random() * memeTemplates.length)]
    setSelectedTemplate(randomTemplate)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meme & Viral Content Generator</h1>
        <p className="text-gray-600">Create viral memes and social media content with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Creation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={contentType} onValueChange={setContentType}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6">
              {viralContentTypes.map(type => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs">
                  <span className="mr-1">{type.icon}</span>
                  <span className="hidden sm:inline">{type.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="meme" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Meme Template</span>
                  </CardTitle>
                  <CardDescription>Choose a template or upload your own image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {memeTemplates.map(template => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate?.id === template.id 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          {template.trending && <Badge className="text-xs">Trending</Badge>}
                        </div>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button onClick={getRandomTemplate} variant="outline" size="sm">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Random Template
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {customImage && (
                    <div className="mt-4">
                      <img src={customImage} alt="Custom" className="max-w-full h-32 object-cover rounded" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Type className="w-5 h-5" />
                    <span>Meme Text</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Niche/Topic</Label>
                    <Input
                      placeholder="e.g., productivity, fitness, tech, humor"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                    />
                  </div>

                  <Button onClick={generateViralContent} disabled={isGenerating} className="w-full">
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Viral Text'}
                  </Button>

                  {selectedTemplate?.textPositions.top && (
                    <div className="space-y-2">
                      <Label>Top Text</Label>
                      <Input
                        placeholder="Enter top text..."
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                      />
                    </div>
                  )}

                  {selectedTemplate?.textPositions.bottom && (
                    <div className="space-y-2">
                      <Label>Bottom Text</Label>
                      <Input
                        placeholder="Enter bottom text..."
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                      />
                    </div>
                  )}

                  {selectedTemplate?.textPositions.center && (
                    <div className="space-y-2">
                      <Label>Center Text</Label>
                      <Textarea
                        placeholder="Enter center text..."
                        value={centerText}
                        onChange={(e) => setCenterText(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={80}
                        min={20}
                        step={5}
                      />
                      <span className="text-sm text-gray-600">{fontSize[0]}px</span>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={fontColor}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="w-12 h-8 rounded border"
                        />
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-12 h-8 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other content types */}
            {viralContentTypes.slice(1).map(type => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>{type.name} Generator</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Niche/Topic</Label>
                      <Input
                        placeholder="e.g., productivity, fitness, tech, motivation"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                      />
                    </div>

                    <Button onClick={generateViralContent} disabled={isGenerating} className="w-full">
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : `Generate ${type.name}`}
                    </Button>

                    {centerText && (
                      <div className="space-y-2">
                        <Label>Generated Content</Label>
                        <Textarea
                          value={centerText}
                          onChange={(e) => setCenterText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Generate & Download */}
          {contentType === 'meme' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <Button 
                    onClick={generateMemeImage} 
                    disabled={isGenerating || (!selectedTemplate && !customImage)}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Creating...' : 'Create Meme'}
                  </Button>
                  {generatedMeme && (
                    <Button onClick={downloadMeme} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview & Social Panel */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedMeme ? (
                <img src={generatedMeme} alt="Generated meme" className="w-full rounded-lg" />
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Image className="w-12 h-12 mx-auto mb-2" />
                    <p>Your meme will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media Kit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5" />
                <span>Social Media Kit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {caption && (
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {hashtags.length > 0 && (
                <div className="space-y-2">
                  <Label>Hashtags</Label>
                  <div className="flex flex-wrap gap-1">
                    {hashtags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    value={hashtags.map(tag => `#${tag}`).join(' ')}
                    onChange={(e) => {
                      const newTags = e.target.value
                        .split(' ')
                        .map(tag => tag.replace('#', '').trim())
                        .filter(tag => tag.length > 0)
                      setHashtags(newTags)
                    }}
                    rows={3}
                    className="text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['AI & Technology', 'Remote Work', 'Productivity Hacks', 'Mental Health', 'Crypto & NFTs', 'Sustainable Living'].map(topic => (
                  <Button
                    key={topic}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => setNiche(topic)}
                  >
                    <span className="mr-2">🔥</span>
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}