import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  StarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  HeartIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { blink } from '../blink/client'
import { Template, Project } from '../types'

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'featured' | 'my-projects'>('featured')

  const categories = [
    'all', 'business', 'marketing', 'education', 'health', 'finance', 
    'productivity', 'creative', 'technology', 'lifestyle'
  ]

  const loadTemplatesAndProjects = async () => {
    try {
      // Load user projects
      const userProjects = await blink.db.projects.list({
        orderBy: { updatedAt: 'desc' }
      })
      setProjects(userProjects)

      // Generate featured templates (mock data for now)
      const featuredTemplates: Template[] = [
        {
          id: 'template_1',
          name: 'Digital Marketing Ebook',
          description: 'Comprehensive guide to digital marketing strategies',
          category: 'marketing',
          productType: 'ebook',
          content: {
            title: 'The Complete Digital Marketing Guide',
            chapters: 8,
            tone: 'Professional'
          },
          preview: 'A comprehensive guide covering SEO, social media, email marketing...',
          rating: 4.8,
          downloads: 1250,
          tags: ['marketing', 'seo', 'social media'],
          isPremium: false,
          createdBy: 'AI Builder Team',
          createdAt: '2024-01-15',
          featured: true
        },
        {
          id: 'template_2',
          name: 'Productivity Planner',
          description: 'Daily and weekly productivity planning template',
          category: 'productivity',
          productType: 'planner',
          content: {
            title: 'Ultimate Productivity Planner',
            timeframe: 'Daily',
            focus: 'Personal'
          },
          preview: 'Boost your productivity with this comprehensive planning system...',
          rating: 4.9,
          downloads: 890,
          tags: ['productivity', 'planning', 'goals'],
          isPremium: false,
          createdBy: 'Productivity Expert',
          createdAt: '2024-01-20',
          featured: true
        },
        {
          id: 'template_3',
          name: 'Social Media Content Pack',
          description: '30 days of ready-to-post social media content',
          category: 'marketing',
          productType: 'social-media-pack',
          content: {
            platform: 'All Platforms',
            posts: 30,
            style: 'Mixed'
          },
          preview: '30 engaging social media posts designed to boost engagement...',
          rating: 4.7,
          downloads: 2100,
          tags: ['social media', 'content', 'engagement'],
          isPremium: true,
          createdBy: 'Social Media Pro',
          createdAt: '2024-01-25',
          featured: true
        }
      ]
      setTemplates(featuredTemplates)

    } catch (error) {
      console.error('Error loading templates and projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplatesAndProjects()
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const applyTemplate = async (template: Template) => {
    try {
      // Create a new project based on the template
      const newProject: Omit<Project, 'id'> = {
        title: `${template.name} (Copy)`,
        description: template.description,
        productType: template.productType,
        content: template.content,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current_user',
        tags: template.tags
      }

      const project = await blink.db.projects.create({
        id: `project_${Date.now()}`,
        ...newProject
      })

      // Navigate to the builder with the template data
      window.location.href = `/builder/${template.productType}?template=${template.id}`
    } catch (error) {
      console.error('Error using template:', error)
    }
  }

  const duplicateProject = async (project: Project) => {
    try {
      const duplicatedProject: Omit<Project, 'id'> = {
        ...project,
        title: `${project.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      }

      await blink.db.projects.create({
        id: `project_${Date.now()}`,
        ...duplicatedProject
      })

      // Reload projects
      loadTemplatesAndProjects()
    } catch (error) {
      console.error('Error duplicating project:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates & Projects</h1>
          <p className="text-gray-600 mt-1">Browse featured templates or manage your projects</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('featured')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'featured'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Featured Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-projects'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Projects ({projects.length})
          </button>
        </nav>
      </div>

      {activeTab === 'featured' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    {template.isPremium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-3">{template.preview}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {template.rating}
                    </div>
                    <div className="flex items-center">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      {template.downloads.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      {Math.floor(template.downloads * 0.1)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyTemplate(template)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Use Template
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'my-projects' && (
        <div className="space-y-6">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'generating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        {project.productType} • {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                      {project.wordCount && (
                        <p className="text-sm text-gray-500">
                          {project.wordCount} words
                        </p>
                      )}
                    </div>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/builder/${project.productType}`}
                        className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => duplicateProject(project)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <Link
                        to="/export"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Create your first project to get started.</p>
              <Link
                to="/builder"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Create Project
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}