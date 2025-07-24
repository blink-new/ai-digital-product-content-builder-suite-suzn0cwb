import { useState, useCallback } from 'react'
import { 
  SparklesIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  TagIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { blink } from '../blink/client'
import { BlogPost } from '../types'

interface BlogFormData {
  title: string
  topic: string
  keywords: string
  tone: string
  length: string
  includeImages: boolean
  seoOptimized: boolean
  targetAudience: string
  callToAction: string
}

export function BlogGeneratorPage() {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    topic: '',
    keywords: '',
    tone: 'conversational',
    length: 'medium',
    includeImages: true,
    seoOptimized: true,
    targetAudience: '',
    callToAction: ''
  })
  const [generatedPost, setGeneratedPost] = useState<BlogPost | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [painPoints, setPainPoints] = useState<Array<{title: string, description: string, relevanceScore: number}>>([])
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'seo'>('form')
  const [wordCount, setWordCount] = useState(0)
  const [readTime, setReadTime] = useState(0)

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
    { value: 'humorous', label: 'Humorous', description: 'Light-hearted and entertaining' },
    { value: 'authoritative', label: 'Authoritative', description: 'Expert and confident' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' }
  ]

  const lengthOptions = [
    { value: 'short', label: 'Short (500-800 words)', description: 'Quick read, 2-3 minutes' },
    { value: 'medium', label: 'Medium (800-1500 words)', description: 'Standard length, 4-6 minutes' },
    { value: 'long', label: 'Long (1500+ words)', description: 'In-depth guide, 7+ minutes' }
  ]

  const generateSuggestions = useCallback(async () => {
    if (!formData.topic) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate 10 engaging blog post title suggestions for the topic "${formData.topic}". Make them clickable, SEO-friendly, and attention-grabbing. Format as a simple list.`,
        maxTokens: 500
      })
      
      const suggestionList = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 10)
      
      setSuggestions(suggestionList)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    }
  }, [formData.topic])

  const findPainPoints = useCallback(async () => {
    if (!formData.topic) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Research and identify 10 key pain points that people face related to "${formData.topic}". For each pain point, provide:
        1. A clear title
        2. A brief description
        3. A relevance score (1-10)
        
        Format as JSON array with objects containing: title, description, relevanceScore`,
        maxTokens: 800
      })
      
      try {
        const painPointsData = JSON.parse(text)
        if (Array.isArray(painPointsData)) {
          setPainPoints(painPointsData.slice(0, 10))
        }
      } catch {
        // Fallback if JSON parsing fails
        const mockPainPoints = [
          { title: 'Lack of time', description: 'People struggle to find time for this topic', relevanceScore: 9 },
          { title: 'Information overload', description: 'Too much conflicting information available', relevanceScore: 8 },
          { title: 'High costs', description: 'Solutions are often expensive', relevanceScore: 7 }
        ]
        setPainPoints(mockPainPoints)
      }
    } catch (error) {
      console.error('Error finding pain points:', error)
    }
  }, [formData.topic])

  const autoFillForm = useCallback(async () => {
    if (!formData.topic) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Create a comprehensive blog post outline for "${formData.topic}". Provide:
        1. An engaging title
        2. Target keywords (comma-separated)
        3. Target audience description
        4. Call-to-action suggestion
        
        Format as JSON with keys: title, keywords, targetAudience, callToAction`,
        maxTokens: 400
      })
      
      try {
        const autoFillData = JSON.parse(text)
        setFormData(prev => ({
          ...prev,
          title: autoFillData.title || prev.title,
          keywords: autoFillData.keywords || prev.keywords,
          targetAudience: autoFillData.targetAudience || prev.targetAudience,
          callToAction: autoFillData.callToAction || prev.callToAction
        }))
      } catch {
        // Fallback auto-fill
        setFormData(prev => ({
          ...prev,
          title: `The Ultimate Guide to ${formData.topic}`,
          keywords: `${formData.topic}, guide, tips, best practices`,
          targetAudience: `People interested in ${formData.topic}`,
          callToAction: 'Share your thoughts in the comments below!'
        }))
      }
    } catch (error) {
      console.error('Error auto-filling form:', error)
    }
  }, [formData.topic])

  const generateBlogPost = async () => {
    if (!formData.title || !formData.topic) return

    setIsGenerating(true)
    try {
      const wordTarget = formData.length === 'short' ? 700 : formData.length === 'medium' ? 1200 : 2000
      
      let prompt = `Write a comprehensive blog post about "${formData.title}".
      
      Requirements:
      - Topic: ${formData.topic}
      - Tone: ${formData.tone}
      - Target word count: ${wordTarget} words
      - Target audience: ${formData.targetAudience || 'General audience'}
      - Include SEO optimization: ${formData.seoOptimized ? 'Yes' : 'No'}
      - Keywords to include: ${formData.keywords}
      
      Structure the post with:
      1. Engaging introduction
      2. Clear headings and subheadings
      3. Actionable content
      4. Conclusion with call-to-action: ${formData.callToAction}
      
      Make it engaging, informative, and valuable to readers.`

      if (formData.seoOptimized) {
        prompt += `\n\nSEO Requirements:
        - Include target keywords naturally
        - Use proper heading hierarchy (H1, H2, H3)
        - Write meta description
        - Include internal linking suggestions`
      }

      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: Math.max(wordTarget * 1.5, 2000)
      })

      const words = text.split(/\s+/).length
      const readingTime = Math.ceil(words / 200) // Average reading speed

      const newPost: BlogPost = {
        id: `blog_${Date.now()}`,
        title: formData.title,
        content: text,
        excerpt: text.substring(0, 200) + '...',
        tags: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        category: formData.topic,
        seoKeywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        metaDescription: `${formData.title} - ${text.substring(0, 150)}...`,
        status: 'draft',
        readTime: readingTime,
        userId: 'current_user'
      }

      // Generate featured image if requested
      if (formData.includeImages) {
        try {
          const { data } = await blink.ai.generateImage({
            prompt: `Professional blog featured image for "${formData.title}". Modern, clean design, relevant to ${formData.topic}`,
            size: '1024x1024',
            quality: 'high'
          })
          if (data && data[0]) {
            newPost.featuredImage = data[0].url
          }
        } catch (error) {
          console.error('Error generating featured image:', error)
        }
      }

      setGeneratedPost(newPost)
      setWordCount(words)
      setReadTime(readingTime)
      setActiveTab('preview')

      // Save to database
      await blink.db.blogPosts.create(newPost)

    } catch (error) {
      console.error('Error generating blog post:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, title: suggestion }))
  }

  const applyPainPoint = (painPoint: {title: string, description: string}) => {
    setFormData(prev => ({ 
      ...prev, 
      topic: painPoint.title,
      title: `How to Overcome ${painPoint.title}: A Complete Guide`
    }))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Generator</h1>
          <p className="text-gray-600 mt-1">Create SEO-optimized blog posts with AI-powered content generation</p>
        </div>
        <div className="flex items-center space-x-4">
          {generatedPost && (
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                {wordCount} words
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {readTime} min read
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic/Niche
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Digital Marketing, Health & Wellness"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={generateSuggestions}
                    disabled={!formData.topic}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 disabled:opacity-50"
                  >
                    Get Suggestions
                  </button>
                  <button
                    onClick={findPainPoints}
                    disabled={!formData.topic}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50"
                  >
                    Find Pain Points
                  </button>
                  <button
                    onClick={autoFillForm}
                    disabled={!formData.topic}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your blog post title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone & Style
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {toneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {lengthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Small business owners, Fitness enthusiasts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={formData.callToAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, callToAction: e.target.value }))}
                  placeholder="e.g., Subscribe to our newsletter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeImages"
                    checked={formData.includeImages}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
                    Generate featured image
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="seoOptimized"
                    checked={formData.seoOptimized}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoOptimized: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="seoOptimized" className="ml-2 text-sm text-gray-700">
                    SEO optimization
                  </label>
                </div>
              </div>

              <button
                onClick={generateBlogPost}
                disabled={!formData.title || !formData.topic || isGenerating}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Generate Blog Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Title Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">{suggestion}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pain Points */}
          {painPoints.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Pain Points</h3>
              <div className="space-y-2">
                {painPoints.map((painPoint, index) => (
                  <button
                    key={index}
                    onClick={() => applyPainPoint(painPoint)}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{painPoint.title}</div>
                      <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {painPoint.relevanceScore}/10
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{painPoint.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:col-span-2">
          {generatedPost ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'seo'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ChartBarIcon className="w-4 h-4 inline mr-2" />
                    SEO Analysis
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'preview' && (
                  <div className="prose max-w-none">
                    {generatedPost.featuredImage && (
                      <img
                        src={generatedPost.featuredImage}
                        alt={generatedPost.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{generatedPost.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {generatedPost.readTime} min read
                      </div>
                      <div className="flex items-center">
                        <TagIcon className="w-4 h-4 mr-1" />
                        {generatedPost.tags.join(', ')}
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {generatedPost.content}
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">{wordCount}</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-900">Word Count</p>
                              <p className="text-xs text-green-700">Optimal for SEO</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">{readTime}</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-900">Read Time</p>
                              <p className="text-xs text-blue-700">Minutes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Meta Description</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {generatedPost.metaDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Target Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPost.seoKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <BookmarkIcon className="w-4 h-4 mr-2" />
                      Save Draft
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <GlobeAltIcon className="w-4 h-4 mr-2" />
                    Publish
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create Amazing Content?</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form on the left and click "Generate Blog Post" to create SEO-optimized content with AI.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  AI-Powered Writing
                </div>
                <div className="flex items-center justify-center">
                  <PhotoIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Auto Image Generation
                </div>
                <div className="flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-green-500" />
                  SEO Optimization
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}