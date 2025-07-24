export interface ProductType {
  id: string
  name: string
  category: string
  description: string
  icon: string
  fields: ProductField[]
  tags?: string[]
  trending?: boolean
  monetization?: MonetizationStrategy[]
}

export interface ProductField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'multiselect'
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface Project {
  id: string
  title: string
  description: string
  productType: string
  content: Record<string, any>
  generatedContent?: string
  wordCount?: number
  status: 'draft' | 'generating' | 'completed' | 'exported'
  createdAt: string
  updatedAt: string
  userId: string
  tags?: string[]
  isTemplate?: boolean
  templateRating?: number
  downloads?: number
  monetization?: MonetizationStrategy[]
}

export interface AISuggestion {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  trending?: boolean
  popularity?: number
  tags?: string[]
}

export interface PainPoint {
  id: string
  title: string
  description: string
  source: string
  relevanceScore: number
  category: string
  trending?: boolean
  solutions?: string[]
}

export interface ExportFormat {
  id: string
  name: string
  extension: string
  description: string
  icon: string
  features: string[]
  premium?: boolean
}

export interface MonetizationStrategy {
  id: string
  name: string
  description: string
  priceRange: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  potential: 'Low' | 'Medium' | 'High'
  examples: string[]
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  seoKeywords: string[]
  metaDescription: string
  featuredImage?: string
  status: 'draft' | 'published'
  publishedAt?: string
  readTime: number
  userId: string
}

export interface SocialMediaPost {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
  content: string
  caption: string
  hashtags: string[]
  images?: string[]
  scheduledAt?: string
  status: 'draft' | 'scheduled' | 'published'
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
  userId: string
}

export interface MemeTemplate {
  id: string
  name: string
  imageUrl: string
  textAreas: {
    id: string
    x: number
    y: number
    width: number
    height: number
    fontSize: number
    color: string
    fontFamily: string
    textAlign: 'left' | 'center' | 'right'
  }[]
  category: string
  trending?: boolean
  usage: number
}

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  costPerToken: number
  maxTokens: number
  bestFor: string[]
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'input' | 'ai_generation' | 'review' | 'export'
  dependencies: string[]
  estimatedTime: number
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  productTypes: string[]
  automated: boolean
  estimatedDuration: number
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  productType: string
  content: Record<string, any>
  preview: string
  rating: number
  downloads: number
  tags: string[]
  isPremium: boolean
  createdBy: string
  createdAt: string
  featured?: boolean
}

export interface Analytics {
  totalProjects: number
  completedProjects: number
  totalExports: number
  popularProductTypes: { name: string; count: number }[]
  recentActivity: {
    type: string
    description: string
    timestamp: string
  }[]
  monthlyStats: {
    month: string
    projects: number
    exports: number
  }[]
}