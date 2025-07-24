import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  SparklesIcon,
  DocumentTextIcon,
  PhotoIcon,
  ShareIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { blink } from '../blink/client'
import { allProductTypes } from '../data/productTypes'
import { ProductType, Project } from '../types'

export function DashboardPage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalExports: 0,
    thisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      // Load recent projects
      const projects = await blink.db.projects.list({
        orderBy: { updatedAt: 'desc' },
        limit: 5
      })
      setRecentProjects(projects)

      // Calculate stats
      const allProjects = await blink.db.projects.list()
      const completed = allProjects.filter(p => p.status === 'completed')
      const thisMonth = allProjects.filter(p => {
        const projectDate = new Date(p.createdAt)
        const now = new Date()
        return projectDate.getMonth() === now.getMonth() && 
               projectDate.getFullYear() === now.getFullYear()
      })

      setStats({
        totalProjects: allProjects.length,
        completedProjects: completed.length,
        totalExports: completed.length, // Assuming completed projects are exported
        thisMonth: thisMonth.length
      })

      // Set trending products (mock data for now)
      const trending = allProductTypes
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(product => ({ ...product, trending: true }))
      setTrendingProducts(trending)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const quickActions = [
    {
      name: 'Create Product',
      description: 'Start with AI-powered templates',
      href: '/builder',
      icon: DocumentTextIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Generate Meme',
      description: 'Viral content in seconds',
      href: '/meme-generator',
      icon: PhotoIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Write Blog',
      description: 'SEO-optimized articles',
      href: '/blog-generator',
      icon: ShareIcon,
      color: 'bg-green-500'
    },
    {
      name: 'View Analytics',
      description: 'Track your performance',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-amber-500'
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalProjects}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.completedProjects}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUpIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Exports</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalExports}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.thisMonth}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                  {action.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link to="/templates" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            {recentProjects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <li key={project.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {project.productType} • {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
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
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No projects yet. Create your first one!</p>
                <Link
                  to="/builder"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trending Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Trending Products</h2>
            <Link to="/builder" className="text-sm text-indigo-600 hover:text-indigo-500">
              Explore all
            </Link>
          </div>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {trendingProducts.map((product) => (
                <li key={product.id} className="p-4 hover:bg-gray-50">
                  <Link to={`/builder/${product.id}`} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <TrendingUpIcon className="w-4 h-4 text-orange-500" />
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-500">Hot</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}