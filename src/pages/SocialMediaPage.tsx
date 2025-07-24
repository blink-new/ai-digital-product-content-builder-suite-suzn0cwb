import { useState, useCallback } from 'react'
import { 
  SparklesIcon, 
  PhotoIcon,
  ShareIcon,
  HashtagIcon,
  CalendarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { blink } from '../blink/client'
import { SocialMediaPost } from '../types'

interface SocialFormData {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
  contentType: 'promotional' | 'educational' | 'inspirational' | 'entertainment' | 'news'
  topic: string
  tone: string
  includeHashtags: boolean
  includeEmojis: boolean
  includeImage: boolean
  targetAudience: string
  callToAction: string
  postLength: 'short' | 'medium' | 'long'
}

const platformConfigs = {
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    maxLength: 2200,
    optimalLength: 125,
    features: ['Stories', 'Reels', 'Posts', 'IGTV']
  },
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-600',
    maxLength: 63206,
    optimalLength: 40,
    features: ['Posts', 'Stories', 'Events', 'Groups']
  },
  twitter: {
    name: 'Twitter/X',
    color: 'bg-black',
    maxLength: 280,
    optimalLength: 100,
    features: ['Tweets', 'Threads', 'Spaces', 'Lists']
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-700',
    maxLength: 3000,
    optimalLength: 150,
    features: ['Posts', 'Articles', 'Stories', 'Events']
  },
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    maxLength: 2200,
    optimalLength: 100,
    features: ['Videos', 'Stories', 'Live', 'Effects']
  }
}

const contentTypes = [
  { value: 'promotional', label: 'Promotional', description: 'Product/service promotion' },
  { value: 'educational', label: 'Educational', description: 'Tips, tutorials, how-tos' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivational content' },
  { value: 'entertainment', label: 'Entertainment', description: 'Fun, engaging content' },
  { value: 'news', label: 'News/Updates', description: 'Industry news, updates' }
]

export function SocialMediaPage() {
  const [formData, setFormData] = useState<SocialFormData>({
    platform: 'instagram',
    contentType: 'educational',
    topic: '',
    tone: 'conversational',
    includeHashtags: true,
    includeEmojis: true,
    includeImage: true,
    targetAudience: '',
    callToAction: '',
    postLength: 'medium'
  })
  const [generatedPosts, setGeneratedPosts] = useState<SocialMediaPost[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<SocialMediaPost | null>(null)
  const [previewMode, setPreviewMode] = useState<'grid' | 'single'>('grid')

  const generateSuggestions = useCallback(async () => {
    if (!formData.topic) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate 10 engaging ${formData.platform} post ideas for "${formData.topic}". 
        Content type: ${formData.contentType}
        Make them platform-specific, engaging, and likely to get high engagement.
        Format as a simple numbered list.`,
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
  }, [formData.topic, formData.platform, formData.contentType])

  const findTrendingHashtags = useCallback(async () => {
    if (!formData.topic) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Find 15 trending and relevant hashtags for "${formData.topic}" on ${formData.platform}. 
        Include a mix of:
        - Popular hashtags (high volume)
        - Niche hashtags (targeted)
        - Branded hashtags
        - Community hashtags
        
        Format as a simple list without the # symbol.`,
        maxTokens: 300
      })
      
      const hashtagList = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^#/, '').replace(/^\d+\.\s*/, '').trim())
        .slice(0, 15)
      
      setTrendingHashtags(hashtagList)
    } catch (error) {
      console.error('Error finding trending hashtags:', error)
    }
  }, [formData.topic, formData.platform])

  const generateSocialPosts = async () => {
    if (!formData.topic) return

    setIsGenerating(true)
    try {
      const platform = platformConfigs[formData.platform]
      const targetLength = formData.postLength === 'short' ? 
        Math.floor(platform.optimalLength * 0.7) : 
        formData.postLength === 'medium' ? 
        platform.optimalLength : 
        Math.floor(platform.maxLength * 0.8)

      // Generate multiple post variations
      const postPromises = Array.from({ length: 6 }, async (_, index) => {
        const variation = ['engaging', 'informative', 'casual', 'professional', 'creative', 'trending'][index]
        
        const prompt = `Create a ${variation} ${formData.platform} post about "${formData.topic}".
        
        Requirements:
        - Platform: ${formData.platform}
        - Content type: ${formData.contentType}
        - Tone: ${formData.tone}
        - Target length: ${targetLength} characters
        - Target audience: ${formData.targetAudience || 'General audience'}
        - Include call-to-action: ${formData.callToAction || 'Engage with the post'}
        
        ${formData.includeEmojis ? 'Include relevant emojis naturally throughout the text.' : 'Do not use emojis.'}
        ${formData.includeHashtags ? 'End with 5-10 relevant hashtags.' : 'Do not include hashtags.'}
        
        Make it platform-appropriate and engaging for ${formData.platform} users.`

        const { text } = await blink.ai.generateText({
          prompt,
          maxTokens: 400
        })

        // Generate image if requested
        let imageUrl = ''
        if (formData.includeImage) {
          try {
            const { data } = await blink.ai.generateImage({
              prompt: `${formData.platform} post image for "${formData.topic}". ${variation} style, social media optimized, eye-catching`,
              size: '1024x1024',
              quality: 'high'
            })
            if (data && data[0]) {
              imageUrl = data[0].url
            }
          } catch (error) {
            console.error('Error generating image:', error)
          }
        }

        // Extract hashtags from the content
        const hashtagMatches = text.match(/#\w+/g) || []
        const hashtags = hashtagMatches.map(tag => tag.substring(1))
        
        // Clean content (remove hashtags for separate display)
        const cleanContent = text.replace(/#\w+/g, '').trim()

        const post: SocialMediaPost = {
          id: `social_${Date.now()}_${index}`,
          platform: formData.platform,
          content: cleanContent,
          caption: cleanContent,
          hashtags,
          images: imageUrl ? [imageUrl] : [],
          status: 'draft',
          engagement: {
            likes: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50)
          },
          userId: 'current_user'
        }

        return post
      })

      const posts = await Promise.all(postPromises)
      setGeneratedPosts(posts)
      setSelectedPost(posts[0])

      // Save posts to database
      for (const post of posts) {
        await blink.db.socialPosts.create(post)
      }

    } catch (error) {
      console.error('Error generating social posts:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, topic: suggestion }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const renderPostPreview = (post: SocialMediaPost) => {
    const platform = platformConfigs[post.platform]
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Platform Header */}
        <div className={`${platform.color} text-white p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShareIcon className="w-4 h-4" />
              </div>
              <span className="font-medium">{platform.name}</span>
            </div>
            <span className="text-xs opacity-75">Draft</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          {post.images && post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post visual"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
          )}
          
          <div className="space-y-3">
            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
            
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Engagement Preview */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <HeartIcon className="w-4 h-4 mr-1" />
                {post.engagement?.likes || 0}
              </div>
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                {post.engagement?.comments || 0}
              </div>
              <div className="flex items-center">
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                {post.engagement?.shares || 0}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(post.content + '\n\n' + post.hashtags.map(h => `#${h}`).join(' '))}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media Generator</h1>
          <p className="text-gray-600 mt-1">Create engaging social media content for all platforms with AI</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setPreviewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                previewMode === 'grid'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setPreviewMode('single')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                previewMode === 'single'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Single
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Post Configuration</h2>
            
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Platform
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(platformConfigs).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFormData(prev => ({ ...prev, platform: key as any }))}
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      formData.platform === key
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${config.color} mr-3`}></div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{config.name}</div>
                      <div className="text-xs text-gray-500">Max: {config.maxLength} chars</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Subject
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Digital Marketing Tips"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={generateSuggestions}
                  disabled={!formData.topic}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 disabled:opacity-50"
                >
                  Get Ideas
                </button>
                <button
                  onClick={findTrendingHashtags}
                  disabled={!formData.topic}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  Find Hashtags
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeHashtags"
                  checked={formData.includeHashtags}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeHashtags" className="ml-2 text-sm text-gray-700">
                  Include hashtags
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeEmojis"
                  checked={formData.includeEmojis}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeEmojis: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeEmojis" className="ml-2 text-sm text-gray-700">
                  Include emojis
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImage"
                  checked={formData.includeImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeImage: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeImage" className="ml-2 text-sm text-gray-700">
                  Generate images
                </label>
              </div>
            </div>

            <button
              onClick={generateSocialPosts}
              disabled={!formData.topic || isGenerating}
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
                  Generate Posts
                </>
              )}
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Ideas</h3>
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

          {/* Trending Hashtags */}
          {trendingHashtags.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(`#${hashtag}`)}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    <HashtagIcon className="w-3 h-3 mr-1" />
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:col-span-3">
          {generatedPosts.length > 0 ? (
            <div className="space-y-6">
              {previewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedPosts.map((post) => (
                    <div key={post.id}>
                      {renderPostPreview(post)}
                    </div>
                  ))}
                </div>
              ) : (
                selectedPost && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Post Preview</h3>
                      <div className="flex items-center space-x-2">
                        {generatedPosts.map((post, index) => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className={`w-8 h-8 rounded-full text-xs font-medium ${
                              selectedPost.id === post.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="max-w-md mx-auto">
                      {renderPostPreview(selectedPost)}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <ShareIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Go Viral?</h3>
              <p className="text-gray-600 mb-6">
                Configure your settings and generate engaging social media content for any platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  AI-Generated Content
                </div>
                <div className="flex items-center justify-center">
                  <PhotoIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Auto Image Creation
                </div>
                <div className="flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
                  Trending Hashtags
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}