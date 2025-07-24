import { useState, useEffect } from 'react'
import { Search, Filter, Star, Download, Eye, Copy, Trash2, Plus, BookOpen, TrendingUp, Clock, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from '../../hooks/use-toast'
import { blink } from '../../blink/client'

interface Template {
  id: string
  title: string
  description: string
  category: string
  productType: string
  content: string
  wordCount: number
  downloads: number
  rating: number
  tags: string[]
  createdAt: string
  updatedAt: string
  userId: string
  isPublic: boolean
  isFeatured: boolean
  previewImage?: string
}

interface SavedProject {
  id: string
  title: string
  productType: string
  content: Record<string, any>
  wordCount?: number
  status: 'draft' | 'generating' | 'completed'
  createdAt: string
  updatedAt: string
  userId: string
}

const categories = [
  'All Categories',
  'Business',
  'Marketing',
  'Education',
  'Health & Fitness',
  'Technology',
  'Personal Development',
  'Finance',
  'Creative',
  'Productivity'
]

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' }
]

// Mock templates data
const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Ultimate Productivity Planner',
    description: 'Comprehensive daily and weekly planning system for maximum productivity',
    category: 'Productivity',
    productType: 'planner',
    content: 'Complete productivity planning system with goal tracking, time blocking, and habit formation...',
    wordCount: 2500,
    downloads: 1247,
    rating: 4.8,
    tags: ['productivity', 'planning', 'goals', 'habits'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'user1',
    isPublic: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Social Media Content Calendar',
    description: '30-day content calendar with viral post ideas and engagement strategies',
    category: 'Marketing',
    productType: 'content-calendar',
    content: 'Strategic social media planning with trending topics, hashtag research, and engagement tactics...',
    wordCount: 1800,
    downloads: 892,
    rating: 4.6,
    tags: ['social-media', 'marketing', 'content', 'viral'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    userId: 'user2',
    isPublic: true,
    isFeatured: false
  },
  {
    id: '3',
    title: 'AI Business Plan Template',
    description: 'Complete business plan template optimized for AI and tech startups',
    category: 'Business',
    productType: 'business-plan',
    content: 'Comprehensive business plan covering market analysis, financial projections, and growth strategies...',
    wordCount: 4200,
    downloads: 634,
    rating: 4.9,
    tags: ['business', 'startup', 'ai', 'planning'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    userId: 'user3',
    isPublic: true,
    isFeatured: true
  }
]

export function TemplateLibrary() {
  const [templates] = useState<Template[]>(mockTemplates)
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('popular')
  const [loading, setLoading] = useState(false)

  const loadSavedProjects = async () => {
    try {
      setSavedProjects([
        {
          id: 'p1',
          title: 'My Fitness Guide',
          productType: 'ebook',
          content: { title: 'My Fitness Guide', description: 'Complete fitness transformation guide' },
          wordCount: 1500,
          status: 'completed',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          userId: 'current-user'
        }
      ])
    } catch (error) {
      console.error('Error loading saved projects:', error)
    }
  }

  useEffect(() => {
    loadSavedProjects()
  }, [])

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        default:
          return 0
      }
    })

  const handleUseTemplate = async (template: Template) => {
    setLoading(true)
    try {
      const newProject: SavedProject = {
        id: `p${Date.now()}`,
        title: `${template.title} (Copy)`,
        productType: template.productType,
        content: { 
          title: template.title,
          description: template.description,
          generatedContent: template.content
        },
        wordCount: template.wordCount,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user'
      }

      setSavedProjects(prev => [...prev, newProject])

      toast({
        title: "Template used!",
        description: `Created new project: ${template.title}`
      })
    } catch (error) {
      console.error('Error using template:', error)
      toast({
        title: "Error",
        description: "Failed to use template. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      setSavedProjects(prev => prev.filter(p => p.id !== projectId))
      toast({
        title: "Project deleted",
        description: "Project has been removed from your library."
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const duplicateProject = async (project: SavedProject) => {
    try {
      const duplicatedProject: SavedProject = {
        ...project,
        id: `p${Date.now()}`,
        title: `${project.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setSavedProjects(prev => [...prev, duplicatedProject])

      toast({
        title: "Project duplicated",
        description: `Created copy: ${duplicatedProject.title}`
      })
    } catch (error) {
      console.error('Error duplicating project:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate project. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Library</h1>
        <p className="text-gray-600">Discover and use professional templates created by the community</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="saved">My Projects ({savedProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Featured Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      {template.isFeatured && <Badge className="ml-2">Featured</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {template.wordCount.toLocaleString()} words
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{template.rating}</span>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{template.title}</DialogTitle>
                              <DialogDescription>{template.description}</DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{template.content}</pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUseTemplate(template)}
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Saved Projects</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {savedProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved projects yet</h3>
                <p className="text-gray-600 mb-4">Start creating your first digital product or use a template</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map(project => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.content.description || 'No description'}</CardDescription>
                      </div>
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                        {project.wordCount && (
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {project.wordCount.toLocaleString()} words
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{project.productType}</Badge>
                        <span className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          You
                        </span>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => duplicateProject(project)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}