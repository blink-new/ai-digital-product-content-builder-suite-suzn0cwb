import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Download, Sparkles, Search, RefreshCw, Copy, Heart, Share2, Zap, Wand2 } from 'lucide-react'
import { blink } from '../blink/client'
import { humanizeText, humanizationProfiles } from '../utils/humanizer'

interface MemeTemplate {
  id: string
  name: string
  image: string
  textAreas: {
    id: string
    x: number
    y: number
    width: number
    height: number
    fontSize: number
    color: string
    fontWeight: string
    textAlign: string
    defaultText: string
  }[]
}

interface AISuggestion {
  id: string
  text: string
  category: string
  trending: boolean
  engagement: string
}

interface PainPoint {
  id: string
  text: string
  relevance: number
  category: string
  source: string
}

const MemeGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [textInputs, setTextInputs] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isLoadingPainPoints, setIsLoadingPainPoints] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [humanizationLevel, setHumanizationLevel] = useState<keyof typeof humanizationProfiles>('moderate')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const memeTemplates: MemeTemplate[] = [
    {
      id: 'drake',
      name: 'Drake Pointing',
      image: 'https://i.imgflip.com/30b1gx.jpg',
      textAreas: [
        { id: 'top', x: 250, y: 50, width: 250, height: 100, fontSize: 24, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Old way of doing things' },
        { id: 'bottom', x: 250, y: 200, width: 250, height: 100, fontSize: 24, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'New improved way' }
      ]
    },
    {
      id: 'distracted-boyfriend',
      name: 'Distracted Boyfriend',
      image: 'https://i.imgflip.com/1ur9b0.jpg',
      textAreas: [
        { id: 'girlfriend', x: 20, y: 20, width: 150, height: 50, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', defaultText: 'Current solution' },
        { id: 'boyfriend', x: 200, y: 100, width: 150, height: 50, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', defaultText: 'You' },
        { id: 'other-girl', x: 350, y: 20, width: 150, height: 50, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', defaultText: 'Better solution' }
      ]
    },
    {
      id: 'two-buttons',
      name: 'Two Buttons',
      image: 'https://i.imgflip.com/1g8my4.jpg',
      textAreas: [
        { id: 'button1', x: 120, y: 80, width: 120, height: 60, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Option A' },
        { id: 'button2', x: 280, y: 80, width: 120, height: 60, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Option B' },
        { id: 'person', x: 150, y: 200, width: 200, height: 50, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Difficult choice' }
      ]
    },
    {
      id: 'expanding-brain',
      name: 'Expanding Brain',
      image: 'https://i.imgflip.com/1jwhww.jpg',
      textAreas: [
        { id: 'level1', x: 250, y: 50, width: 200, height: 40, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'left', defaultText: 'Basic level' },
        { id: 'level2', x: 250, y: 130, width: 200, height: 40, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'left', defaultText: 'Intermediate level' },
        { id: 'level3', x: 250, y: 210, width: 200, height: 40, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'left', defaultText: 'Advanced level' },
        { id: 'level4', x: 250, y: 290, width: 200, height: 40, fontSize: 16, color: '#000000', fontWeight: 'bold', textAlign: 'left', defaultText: 'Galaxy brain level' }
      ]
    },
    {
      id: 'woman-yelling-cat',
      name: 'Woman Yelling at Cat',
      image: 'https://i.imgflip.com/345v97.jpg',
      textAreas: [
        { id: 'woman', x: 20, y: 50, width: 200, height: 100, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'When someone says...' },
        { id: 'cat', x: 280, y: 50, width: 200, height: 100, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'My reaction' }
      ]
    },
    {
      id: 'change-my-mind',
      name: 'Change My Mind',
      image: 'https://i.imgflip.com/24y43o.jpg',
      textAreas: [
        { id: 'sign', x: 200, y: 200, width: 250, height: 80, fontSize: 20, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Your controversial opinion' }
      ]
    },
    {
      id: 'this-is-fine',
      name: 'This is Fine',
      image: 'https://i.imgflip.com/26am.jpg',
      textAreas: [
        { id: 'top', x: 50, y: 30, width: 300, height: 50, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Everything is falling apart' },
        { id: 'bottom', x: 50, y: 250, width: 300, height: 50, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'This is fine' }
      ]
    },
    {
      id: 'success-kid',
      name: 'Success Kid',
      image: 'https://i.imgflip.com/1bhk.jpg',
      textAreas: [
        { id: 'top', x: 50, y: 30, width: 300, height: 50, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'When you finally...' },
        { id: 'bottom', x: 50, y: 250, width: 300, height: 50, fontSize: 18, color: '#000000', fontWeight: 'bold', textAlign: 'center', defaultText: 'Success!' }
      ]
    }
  ]

  const categories = ['all', 'business', 'lifestyle', 'technology', 'humor', 'motivation', 'trending']

  const generateAISuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate 10 viral meme text suggestions for ${selectedCategory === 'all' ? 'general' : selectedCategory} category. 
        Make them relatable, funny, and engaging. Format as JSON array with id, text, category, trending (boolean), engagement (high/medium/low).
        Focus on current trends, pain points, and relatable situations.`,
        maxTokens: 800
      })

      // Parse the AI response and create suggestions
      const suggestions: AISuggestion[] = []
      const lines = text.split('\n').filter(line => line.trim())
      
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        suggestions.push({
          id: `suggestion_${i + 1}`,
          text: lines[i].replace(/^\d+\.?\s*/, '').trim(),
          category: selectedCategory === 'all' ? 'general' : selectedCategory,
          trending: Math.random() > 0.7,
          engagement: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
        })
      }

      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating AI suggestions:', error)
      // Fallback suggestions
      setAiSuggestions([
        { id: '1', text: 'When you finally understand the assignment', category: 'general', trending: true, engagement: 'high' },
        { id: '2', text: 'Me pretending to work from home', category: 'business', trending: false, engagement: 'medium' },
        { id: '3', text: 'That feeling when your code works on the first try', category: 'technology', trending: true, engagement: 'high' },
        { id: '4', text: 'Monday morning vs Friday afternoon energy', category: 'lifestyle', trending: false, engagement: 'high' },
        { id: '5', text: 'When someone asks if you have plans this weekend', category: 'humor', trending: false, engagement: 'medium' }
      ])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [selectedCategory])

  const findPainPoints = useCallback(async () => {
    setIsLoadingPainPoints(true)
    try {
      const searchResults = await blink.data.search(`${selectedCategory === 'all' ? 'general' : selectedCategory} problems pain points frustrations`, {
        type: 'news',
        limit: 5
      })

      const painPointsData: PainPoint[] = []
      
      if (searchResults.organic_results) {
        searchResults.organic_results.slice(0, 10).forEach((result, index) => {
          painPointsData.push({
            id: `pain_${index + 1}`,
            text: result.title || `Pain point ${index + 1}`,
            relevance: Math.floor(Math.random() * 40) + 60, // 60-100%
            category: selectedCategory === 'all' ? 'general' : selectedCategory,
            source: result.link || 'web'
          })
        })
      }

      // Add some fallback pain points if search doesn't return enough
      if (painPointsData.length < 10) {
        const fallbackPainPoints = [
          'Waiting for slow internet to load',
          'When your phone battery dies at 1%',
          'Trying to remember where you put your keys',
          'When the WiFi stops working during important calls',
          'Forgetting to save your work before computer crashes',
          'When you have 20 browser tabs open',
          'Trying to adult but having no idea what you\'re doing',
          'When you\'re hungry but don\'t know what to eat',
          'Procrastinating until the last minute',
          'When you can\'t find the TV remote'
        ]

        fallbackPainPoints.forEach((point, index) => {
          if (painPointsData.length < 10) {
            painPointsData.push({
              id: `fallback_${index + 1}`,
              text: point,
              relevance: Math.floor(Math.random() * 30) + 70,
              category: 'general',
              source: 'curated'
            })
          }
        })
      }

      setPainPoints(painPointsData.slice(0, 10))
    } catch (error) {
      console.error('Error finding pain points:', error)
      // Fallback pain points
      setPainPoints([
        { id: '1', text: 'Waiting for slow internet', relevance: 95, category: 'technology', source: 'web' },
        { id: '2', text: 'Monday morning blues', relevance: 88, category: 'lifestyle', source: 'web' },
        { id: '3', text: 'Endless meetings that could be emails', relevance: 92, category: 'business', source: 'web' },
        { id: '4', text: 'When your code doesn\'t work', relevance: 87, category: 'technology', source: 'web' },
        { id: '5', text: 'Trying to eat healthy but craving junk food', relevance: 85, category: 'lifestyle', source: 'web' }
      ])
    } finally {
      setIsLoadingPainPoints(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    generateAISuggestions()
    findPainPoints()
  }, [selectedCategory, generateAISuggestions, findPainPoints])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string)
        setSelectedTemplate(null)
        setTextInputs({})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template)
    setCustomImage(null)
    const initialInputs: Record<string, string> = {}
    template.textAreas.forEach(area => {
      initialInputs[area.id] = area.defaultText
    })
    setTextInputs(initialInputs)
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    if (selectedTemplate) {
      const humanizedText = humanizeText(suggestion.text, humanizationProfiles[humanizationLevel])
      const firstTextArea = selectedTemplate.textAreas[0]
      if (firstTextArea) {
        setTextInputs(prev => ({
          ...prev,
          [firstTextArea.id]: humanizedText
        }))
      }
    }
  }

  const applyPainPoint = (painPoint: PainPoint) => {
    if (selectedTemplate) {
      const humanizedText = humanizeText(painPoint.text, humanizationProfiles[humanizationLevel])
      const firstTextArea = selectedTemplate.textAreas[0]
      if (firstTextArea) {
        setTextInputs(prev => ({
          ...prev,
          [firstTextArea.id]: humanizedText
        }))
      }
    }
  }

  const enhancePrompt = async (text: string) => {
    try {
      const { text: enhancedText } = await blink.ai.generateText({
        prompt: `Enhance this meme text to be more viral, engaging, and relatable: "${text}". 
        Make it funnier, more relatable, and likely to get shared. Keep it concise and punchy.
        Return only the enhanced text, nothing else.`,
        maxTokens: 100
      })
      
      return humanizeText(enhancedText.trim(), humanizationProfiles[humanizationLevel])
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      return text
    }
  }

  const handleTextChange = (areaId: string, value: string) => {
    setTextInputs(prev => ({
      ...prev,
      [areaId]: value
    }))
  }

  const enhanceText = async (areaId: string) => {
    const currentText = textInputs[areaId] || ''
    if (!currentText.trim()) return

    setIsGenerating(true)
    try {
      const enhanced = await enhancePrompt(currentText)
      setTextInputs(prev => ({
        ...prev,
        [areaId]: enhanced
      }))
    } catch (error) {
      console.error('Error enhancing text:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMeme = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsGenerating(true)

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = customImage || selectedTemplate?.image || ''
      })

      canvas.width = img.width
      canvas.height = img.height

      // Draw the image
      ctx.drawImage(img, 0, 0)

      // Draw text overlays
      if (selectedTemplate) {
        selectedTemplate.textAreas.forEach(area => {
          const text = textInputs[area.id] || area.defaultText
          
          ctx.font = `${area.fontWeight} ${area.fontSize}px Arial`
          ctx.fillStyle = area.color
          ctx.textAlign = area.textAlign as CanvasTextAlign
          ctx.strokeStyle = area.color === '#FFFFFF' ? '#000000' : '#FFFFFF'
          ctx.lineWidth = 2

          // Word wrap
          const words = text.split(' ')
          const lines: string[] = []
          let currentLine = ''

          words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word
            const metrics = ctx.measureText(testLine)
            if (metrics.width > area.width && currentLine) {
              lines.push(currentLine)
              currentLine = word
            } else {
              currentLine = testLine
            }
          })
          if (currentLine) lines.push(currentLine)

          // Draw text lines
          lines.forEach((line, index) => {
            const y = area.y + (index * (area.fontSize + 5))
            ctx.strokeText(line, area.x + area.width / 2, y)
            ctx.fillText(line, area.x + area.width / 2, y)
          })
        })
      }
    } catch (error) {
      console.error('Error generating meme:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [customImage, selectedTemplate, textInputs])

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `meme_${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const autoFillMeme = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate funny, viral meme text for a ${selectedTemplate.name} meme template. 
        Create ${selectedTemplate.textAreas.length} different text pieces that work together.
        Make them relatable, current, and likely to be shared. Focus on trending topics and common experiences.
        Return only the text pieces separated by | character.`,
        maxTokens: 200
      })

      const textPieces = text.split('|').map(piece => piece.trim())
      const newInputs: Record<string, string> = {}

      selectedTemplate.textAreas.forEach((area, index) => {
        const rawText = textPieces[index] || area.defaultText
        const humanizedText = humanizeText(rawText, humanizationProfiles[humanizationLevel])
        newInputs[area.id] = humanizedText
      })

      setTextInputs(newInputs)
    } catch (error) {
      console.error('Error auto-filling meme:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (selectedTemplate || customImage) {
      generateMeme()
    }
  }, [selectedTemplate, customImage, textInputs, generateMeme])

  const filteredSuggestions = aiSuggestions.filter(suggestion =>
    selectedCategory === 'all' || suggestion.category === selectedCategory
  )

  const filteredPainPoints = painPoints.filter(point =>
    selectedCategory === 'all' || point.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 Viral Meme Generator</h1>
          <p className="text-gray-600">Create viral memes with AI-powered suggestions and custom images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Templates & Upload */}
          <div className="space-y-6">
            {/* Upload Custom Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Custom Image</h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload your own image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Meme Templates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Popular Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {memeTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-indigo-500 ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2">
                      {template.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Humanization Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Humanization Level</h3>
              <select
                value={humanizationLevel}
                onChange={(e) => setHumanizationLevel(e.target.value as keyof typeof humanizationProfiles)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="subtle">Subtle (Professional)</option>
                <option value="moderate">Moderate (Balanced)</option>
                <option value="heavy">Heavy (Very Casual)</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Controls how human-like the AI-generated text appears
              </p>
            </div>
          </div>

          {/* Center Panel - Meme Editor */}
          <div className="space-y-6">
            {/* Meme Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🖼️ Meme Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={autoFillMeme}
                    disabled={!selectedTemplate || isGenerating}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Auto Fill
                  </button>
                  <button
                    onClick={downloadMeme}
                    disabled={!selectedTemplate && !customImage}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px]">
                {selectedTemplate || customImage ? (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[400px] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a template or upload an image to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Text Inputs */}
            {selectedTemplate && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✏️ Edit Text</h3>
                <div className="space-y-4">
                  {selectedTemplate.textAreas.map(area => (
                    <div key={area.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {area.id.replace('-', ' ')} Text
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          value={textInputs[area.id] || area.defaultText}
                          onChange={(e) => handleTextChange(area.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          rows={2}
                          placeholder={area.defaultText}
                        />
                        <button
                          onClick={() => enhanceText(area.id)}
                          disabled={isGenerating}
                          className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Enhance with AI"
                        >
                          <Wand2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - AI Suggestions & Pain Points */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🤖 AI Suggestions</h3>
                <button
                  onClick={generateAISuggestions}
                  disabled={isLoadingSuggestions}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Generating suggestions...</p>
                  </div>
                ) : (
                  filteredSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors group"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-900 flex-1">{suggestion.text}</p>
                        <div className="flex items-center gap-1 ml-2">
                          {suggestion.trending && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">🔥 Trending</span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.engagement === 'high' ? 'bg-green-100 text-green-600' :
                            suggestion.engagement === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {suggestion.engagement}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 capitalize">{suggestion.category}</span>
                        <Copy className="w-3 h-3 text-gray-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pain Points */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🎯 Pain Points</h3>
                <button
                  onClick={findPainPoints}
                  disabled={isLoadingPainPoints}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Search className={`w-4 h-4 ${isLoadingPainPoints ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {isLoadingPainPoints ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Finding pain points...</p>
                  </div>
                ) : (
                  filteredPainPoints.map(painPoint => (
                    <div
                      key={painPoint.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors group"
                      onClick={() => applyPainPoint(painPoint)}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-900 flex-1">{painPoint.text}</p>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">
                          {painPoint.relevance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 capitalize">{painPoint.category}</span>
                        <Copy className="w-3 h-3 text-gray-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemeGeneratorPage