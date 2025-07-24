import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { DashboardPage } from '../pages/DashboardPage'
import { ProductBuilderPage } from '../pages/ProductBuilderPage'
import { TemplatesPage } from '../pages/TemplatesPage'
import MemeGeneratorPage from '../pages/MemeGeneratorPage'
import { BlogGeneratorPage } from '../pages/BlogGeneratorPage'
import { SocialMediaPage } from '../pages/SocialMediaPage'
import { ExportCenterPage } from '../pages/ExportCenterPage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { SettingsPage } from '../pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'builder',
        element: <ProductBuilderPage />
      },
      {
        path: 'builder/:productType',
        element: <ProductBuilderPage />
      },
      {
        path: 'templates',
        element: <TemplatesPage />
      },
      {
        path: 'meme-generator',
        element: <MemeGeneratorPage />
      },
      {
        path: 'blog-generator',
        element: <BlogGeneratorPage />
      },
      {
        path: 'social-media',
        element: <SocialMediaPage />
      },
      {
        path: 'export',
        element: <ExportCenterPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
])