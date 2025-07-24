import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Badge } from '../components/ui/badge'
import { Download, FileText, File, Globe, Hash, Type, Clock, CheckCircle, XCircle } from 'lucide-react'
import { blink } from '../blink/client'
import { exportProject, getExportHistory, saveExportToHistory, type ExportProject, type ExportOptions } from '../utils/exportUtils'

interface Project {
  id: string
  title: string
  content: string
  product_type: string
  created_at: string
  user_id: string
}

interface ExportHistoryItem {
  projectId: string
  projectTitle: string
  format: string
  timestamp: string
  success: boolean
  message: string
}

export const ExportCenterPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedFormat, setSelectedFormat] = useState<string>('')
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeImages: true,
    includeMetadata: true,
    optimizeForPrint: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Professional PDF with styling' },
    { value: 'docx', label: 'Word Document', icon: File, description: 'Microsoft Word compatible' },
    { value: 'html', label: 'HTML Page', icon: Globe, description: 'Responsive web page' },
    { value: 'markdown', label: 'Markdown', icon: Hash, description: 'Perfect for Notion/GitHub' },
    { value: 'text', label: 'Plain Text', icon: Type, description: 'Simple text file' }
  ]

  const loadProjects = async () => {
    try {
      const projectsData = await blink.db.projects.list({
        orderBy: { created_at: 'desc' },
        limit: 50
      })
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadExportHistory = () => {
    const history = getExportHistory()
    setExportHistory(history)
  }

  useEffect(() => {
    loadProjects()
    loadExportHistory()
  }, [])

  const handleExport = async () => {
    if (!selectedProject || !selectedFormat) {
      return
    }

    setIsExporting(true)
    
    try {
      const project = projects.find(p => p.id === selectedProject)
      if (!project) {
        throw new Error('Project not found')
      }

      const exportData: ExportProject = {
        id: project.id,
        title: project.title,
        content: project.content,
        type: project.product_type,
        createdAt: project.created_at,
        metadata: {
          productType: project.product_type,
          userId: project.user_id
        }
      }

      const result = await exportProject(
        exportData,
        selectedFormat as 'pdf' | 'docx' | 'html' | 'markdown' | 'text',
        exportOptions
      )

      // Save to export history
      const historyItem = {
        projectId: project.id,
        projectTitle: project.title,
        format: selectedFormat,
        timestamp: new Date().toISOString(),
        success: result.success,
        message: result.message
      }
      
      saveExportToHistory(historyItem)
      loadExportHistory()

      if (result.success) {
        // Reset form on success
        setSelectedProject('')
        setSelectedFormat('')
      }

    } catch (error) {
      console.error('Export error:', error)
      
      // Save failed export to history
      const project = projects.find(p => p.id === selectedProject)
      if (project) {
        const historyItem = {
          projectId: project.id,
          projectTitle: project.title,
          format: selectedFormat,
          timestamp: new Date().toISOString(),
          success: false,
          message: error instanceof Error ? error.message : 'Export failed'
        }
        
        saveExportToHistory(historyItem)
        loadExportHistory()
      }
    } finally {
      setIsExporting(false)
    }
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject)
  const selectedFormatData = formatOptions.find(f => f.value === selectedFormat)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Center</h1>
        <p className="text-gray-600 mt-2">Export your projects in multiple professional formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Configuration
            </CardTitle>
            <CardDescription>
              Select your project and export format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project to export" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.title}</span>
                        <span className="text-xs text-gray-500">{project.product_type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-1 gap-2">
                {formatOptions.map((format) => {
                  const Icon = format.icon
                  return (
                    <div
                      key={format.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === format.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFormat(format.value)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-gray-500">{format.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Export Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeImages"
                    checked={exportOptions.includeImages}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeImages: checked as boolean }))
                    }
                  />
                  <label htmlFor="includeImages" className="text-sm">
                    Include images (when available)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={exportOptions.includeMetadata}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                    }
                  />
                  <label htmlFor="includeMetadata" className="text-sm">
                    Include project metadata
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="optimizeForPrint"
                    checked={exportOptions.optimizeForPrint}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, optimizeForPrint: checked as boolean }))
                    }
                  />
                  <label htmlFor="optimizeForPrint" className="text-sm">
                    Optimize for printing
                  </label>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={!selectedProject || !selectedFormat || isExporting}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Project
                </>
              )}
            </Button>

            {/* Preview */}
            {selectedProjectData && selectedFormatData && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Project:</strong> {selectedProjectData.title}</div>
                  <div><strong>Type:</strong> {selectedProjectData.product_type}</div>
                  <div><strong>Format:</strong> {selectedFormatData.label}</div>
                  <div><strong>Created:</strong> {new Date(selectedProjectData.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Export History
            </CardTitle>
            <CardDescription>
              Recent export activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exportHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No exports yet</p>
                <p className="text-sm">Your export history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {exportHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.projectTitle}</div>
                      <div className="text-sm text-gray-500">
                        {item.format.toUpperCase()} • {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{item.message}</div>
                    </div>
                    <div className="ml-3">
                      {item.success ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {exportHistory.filter(h => h.success).length}
            </div>
            <div className="text-sm text-gray-600">Successful Exports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{formatOptions.length}</div>
            <div className="text-sm text-gray-600">Export Formats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {exportHistory.length}
            </div>
            <div className="text-sm text-gray-600">Total Exports</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

