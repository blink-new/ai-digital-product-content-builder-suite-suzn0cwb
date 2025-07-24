import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  SparklesIcon, 
  ArrowLeftIcon,
  DocumentTextIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { blink } from '../blink/client'
import { allProductTypes } from '../data/productTypes'
import { ProductType, Project, AISuggestion, PainPoint } from '../types'

export function ProductBuilderPage() {
  const { productType: productTypeId } = useParams()
  const navigate = useNavigate()
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'settings'>('form')
  const [wordCount, setWordCount] = useState(1000)

  useEffect(() => {
    if (productTypeId) {
      const productType = allProductTypes.find(p => p.id === productTypeId)
      if (productType) {
        setSelectedProductType(productType)
        // Initialize form data with default values
        const initialData: Record<string, any> = {}
        productType.fields.forEach(field => {
          initialData[field.id] = field.type === 'boolean' ? false : ''
        })
        setFormData(initialData)
      }
    }
  }, [productTypeId])

  const generateSuggestions = useCallback(async () => {
    if (!selectedProductType) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate 10 creative and trending ${selectedProductType.name} ideas. Make them specific, actionable, and market-ready. Format as JSON array with objects containing: id, title, description, prompt, category.`,
        maxTokens: 800
      })
      
      try {
        const suggestionsData = JSON.parse(text)
        if (Array.isArray(suggestionsData)) {
          setSuggestions(suggestionsData.slice(0, 10))
        }
      } catch {
        // Fallback suggestions
        const fallbackSuggestions = Array.from({ length: 10 }, (_, i) => ({
          id: `suggestion_${i}`,
          title: `${selectedProductType.name} Idea ${i + 1}`,
          description: `Creative ${selectedProductType.name.toLowerCase()} concept`,
          prompt: `Create a ${selectedProductType.name.toLowerCase()} about...`,
          category: selectedProductType.category
        }))
        setSuggestions(fallbackSuggestions)
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
    }
  }, [selectedProductType])

  const findPainPoints = useCallback(async () => {
    if (!selectedProductType) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Research and identify 10 key pain points that people face related to ${selectedProductType.category} and ${selectedProductType.name}. For each pain point, provide: title, description, source, relevanceScore (1-10), category. Format as JSON array.`,
        maxTokens: 1000
      })
      
      try {
        const painPointsData = JSON.parse(text)
        if (Array.isArray(painPointsData)) {
          setPainPoints(painPointsData.slice(0, 10))
        }
      } catch {
        // Fallback pain points
        const fallbackPainPoints = [
          { id: '1', title: 'Lack of time', description: 'People struggle to find time for this', source: 'Market research', relevanceScore: 9, category: selectedProductType.category },
          { id: '2', title: 'Information overload', description: 'Too much conflicting information', source: 'User surveys', relevanceScore: 8, category: selectedProductType.category },
          { id: '3', title: 'High costs', description: 'Solutions are often expensive', source: 'Industry analysis', relevanceScore: 7, category: selectedProductType.category }
        ]
        setPainPoints(fallbackPainPoints)
      }
    } catch (error) {
      console.error('Error finding pain points:', error)
    }
  }, [selectedProductType])

  const autoFillForm = useCallback(async () => {
    if (!selectedProductType) return

    try {
      const { text } = await blink.ai.generateText({
        prompt: `Auto-fill a ${selectedProductType.name} form with realistic, market-ready content. Generate content for these fields: ${selectedProductType.fields.map(f => f.name).join(', ')}. Make it professional and engaging. Format as JSON object with field IDs as keys.`,
        maxTokens: 600
      })
      
      try {
        const autoFillData = JSON.parse(text)
        setFormData(prev => ({ ...prev, ...autoFillData }))
      } catch {
        // Fallback auto-fill
        const fallbackData: Record<string, any> = {}
        selectedProductType.fields.forEach(field => {
          if (field.type === 'text') {
            fallbackData[field.id] = `Sample ${field.name}`
          } else if (field.type === 'textarea') {
            fallbackData[field.id] = `This is a sample ${field.name.toLowerCase()} that demonstrates the type of content that would be generated for this field.`
          } else if (field.type === 'number') {
            fallbackData[field.id] = 5
          } else if (field.type === 'select' && field.options) {
            fallbackData[field.id] = field.options[0]
          }
        })
        setFormData(prev => ({ ...prev, ...fallbackData }))
      }
    } catch (error) {
      console.error('Error auto-filling form:', error)
    }
  }, [selectedProductType])

  const generateContent = async () => {
    if (!selectedProductType) return

    setIsGenerating(true)
    try {
      let prompt = `Create a comprehensive ${selectedProductType.name} based on the following information:\n\n`
      
      selectedProductType.fields.forEach(field => {
        const value = formData[field.id]
        if (value) {
          prompt += `${field.name}: ${value}\n`
        }
      })

      prompt += `\nTarget word count: ${wordCount} words\n`
      prompt += `Make it professional, engaging, and valuable to the target audience.`

      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: Math.max(wordCount * 1.5, 1000)
      })

      setGeneratedContent(text)
      setActiveTab('preview')

      // Save project to database
      const project = {
        id: `project_${Date.now()}`,
        title: formData.title || `${selectedProductType.name} Project`,
        description: formData.description || `Generated ${selectedProductType.name}`,
        product_type: selectedProductType.name,
        content: JSON.stringify(formData),
        generated_content: text,
        word_count: text.split(/\s+/).length,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current_user'
      }

      await blink.db.projects.create(project)

    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion.title,
      description: suggestion.description
    }))
  }

  const applyPainPoint = (painPoint: PainPoint) => {
    setFormData(prev => ({
      ...prev,
      title: `How to Solve ${painPoint.title}`,
      description: painPoint.description
    }))
  }

  if (!selectedProductType) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Builder</h1>
            <p className="text-gray-600 mt-1">Choose a product type to get started</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProductTypes.map((productType) => (
            <button
              key={productType.id}
              onClick={() => navigate(`/builder/${productType.id}`)}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{productType.name}</h3>
                  <p className="text-sm text-gray-500">{productType.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{productType.description}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/builder')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedProductType.name} Builder</h1>
            <p className="text-gray-600 mt-1">{selectedProductType.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Target: {wordCount} words
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentTextIcon className="w-4 h-4 inline mr-2" />
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <EyeIcon className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Cog6ToothIcon className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'form' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {selectedProductType.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: parseInt(e.target.value) || 0 }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'select' && field.options && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required={field.required}
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'boolean' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[field.id] || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.checked }))}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {field.placeholder || field.name}
                        </label>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={autoFillForm}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Auto Fill
                  </button>
                  <button
                    onClick={generateContent}
                    disabled={isGenerating}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {generatedContent ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Fill out the form and click "Generate Content" to see your preview here.
                  </p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Go to Configuration
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Word Count
                  </label>
                  <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value) || 1000)}
                    min="100"
                    max="10000"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 500-2000 words for most content types
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={generateSuggestions}
                className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Get AI Suggestions</div>
                <div className="text-xs text-gray-500">10 creative ideas</div>
              </button>
              <button
                onClick={findPainPoints}
                className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Find Pain Points</div>
                <div className="text-xs text-gray-500">Market research insights</div>
              </button>
              <button
                onClick={() => navigate('/export')}
                disabled={!generatedContent}
                className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-sm font-medium text-gray-900">Export Content</div>
                <div className="text-xs text-gray-500">Multiple formats</div>
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">{suggestion.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pain Points */}
          {painPoints.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Pain Points</h3>
              <div className="space-y-2">
                {painPoints.map((painPoint) => (
                  <button
                    key={painPoint.id}
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
      </div>
    </div>
  )
}