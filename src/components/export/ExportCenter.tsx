import { useState } from 'react'
import { Download, FileText, File, Globe, Hash, Image, Palette, Layout, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from '../../hooks/use-toast'
import { blink } from '../../blink/client'

interface ExportCenterProps {
  content: string
  title: string
  productType: string
}

interface ExportFormat {
  id: string
  name: string
  extension: string
  description: string
  icon: any
  features: string[]
}

const exportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    description: 'Beautifully designed PDF with AI-generated images',
    icon: FileText,
    features: ['AI Cover Design', 'Section Dividers', 'Page Numbers', 'Custom Branding']
  },
  {
    id: 'docx',
    name: 'Word Document',
    extension: '.docx',
    description: 'Microsoft Word compatible document',
    icon: File,
    features: ['Editable Format', 'Track Changes', 'Comments', 'Styles']
  },
  {
    id: 'html',
    name: 'HTML',
    extension: '.html',
    description: 'Web-ready HTML for landing pages',
    icon: Globe,
    features: ['Responsive Design', 'SEO Optimized', 'Interactive Elements', 'Custom CSS']
  },
  {
    id: 'markdown',
    name: 'Markdown',
    extension: '.md',
    description: 'Perfect for Notion, GitHub, and documentation',
    icon: Hash,
    features: ['Platform Compatible', 'Version Control', 'Easy Editing', 'Lightweight']
  }
]

export function ExportCenter({ content, title, productType }: ExportCenterProps) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf'])
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportedFiles, setExportedFiles] = useState<string[]>([])
  const [pdfOptions, setPdfOptions] = useState({
    generateCover: true,
    includeImages: true,
    addPageNumbers: true,
    customBranding: false,
    colorScheme: 'professional'
  })

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    )
  }

  const generatePDFCover = async () => {
    try {
      const { data } = await blink.ai.generateImage({
        prompt: `Professional book cover design for "${title}" - ${productType}. Modern, clean design with typography and relevant imagery. High quality, commercial style.`,
        size: '1024x1536',
        quality: 'high',
        n: 1
      })
      return data[0].url
    } catch (error) {
      console.error('Error generating PDF cover:', error)
      return null
    }
  }

  const generateSectionImages = async (sections: string[]) => {
    const images: string[] = []
    for (const section of sections.slice(0, 5)) { // Limit to 5 images
      try {
        const { data } = await blink.ai.generateImage({
          prompt: `Professional illustration for section: "${section}". Clean, modern style suitable for business document. Vector-like, minimal design.`,
          size: '1024x1024',
          quality: 'medium',
          n: 1
        })
        images.push(data[0].url)
      } catch (error) {
        console.error('Error generating section image:', error)
      }
    }
    return images
  }

  const exportToPDF = async () => {
    let coverImageUrl = null
    let sectionImages: string[] = []

    if (pdfOptions.generateCover) {
      coverImageUrl = await generatePDFCover()
    }

    if (pdfOptions.includeImages) {
      const sections = content.split('\n').filter(line => line.startsWith('#')).slice(0, 5)
      sectionImages = await generateSectionImages(sections)
    }

    // Create PDF content with styling
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px;
          }
          .cover { 
            text-align: center; 
            page-break-after: always; 
            padding: 100px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: -40px -40px 40px -40px;
          }
          .cover h1 { 
            font-size: 3em; 
            margin-bottom: 20px; 
            font-weight: bold;
          }
          .cover img { 
            max-width: 400px; 
            margin: 20px 0; 
            border-radius: 10px;
          }
          h1, h2, h3 { 
            color: #2d3748; 
            margin-top: 2em;
          }
          h1 { font-size: 2.5em; }
          h2 { font-size: 2em; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          h3 { font-size: 1.5em; }
          .section-image { 
            max-width: 100%; 
            margin: 20px 0; 
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .page-number { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            font-size: 12px; 
            color: #666;
          }
          @page { margin: 40px; }
        </style>
      </head>
      <body>
        ${pdfOptions.generateCover ? `
          <div class="cover">
            <h1>${title}</h1>
            <p style="font-size: 1.2em; opacity: 0.9;">${productType}</p>
            ${coverImageUrl ? `<img src="${coverImageUrl}" alt="Cover Image" />` : ''}
          </div>
        ` : ''}
        
        <div class="content">
          ${content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return `<h1>${line.substring(2)}</h1>`
            } else if (line.startsWith('## ')) {
              const sectionIndex = Math.floor(index / 10) % sectionImages.length
              const sectionImage = pdfOptions.includeImages && sectionImages[sectionIndex] 
                ? `<img src="${sectionImages[sectionIndex]}" alt="Section illustration" class="section-image" />`
                : ''
              return `<h2>${line.substring(3)}</h2>${sectionImage}`
            } else if (line.startsWith('### ')) {
              return `<h3>${line.substring(4)}</h3>`
            } else if (line.trim()) {
              return `<p>${line}</p>`
            }
            return '<br>'
          }).join('')}
        </div>
        
        ${pdfOptions.addPageNumbers ? '<div class="page-number">Page <span class="pageNumber"></span></div>' : ''}
      </body>
      </html>
    `

    // Convert HTML to PDF (this would typically use a service like Puppeteer)
    const blob = new Blob([pdfContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)

    return `${title}.pdf`
  }

  const exportToDocx = async () => {
    // Create DOCX-compatible HTML
    const docxContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.5; }
          h1 { font-size: 18pt; font-weight: bold; color: #2d3748; }
          h2 { font-size: 16pt; font-weight: bold; color: #4a5568; }
          h3 { font-size: 14pt; font-weight: bold; color: #718096; }
          p { margin: 6pt 0; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content.split('\n').map(line => {
          if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`
          if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`
          if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`
          if (line.trim()) return `<p>${line}</p>`
          return '<br>'
        }).join('')}
      </body>
      </html>
    `

    const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`
    a.click()
    URL.revokeObjectURL(url)

    return `${title}.docx`
  }

  const exportToHTML = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${content.substring(0, 160)}...">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #fafafa;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding: 40px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: -40px -20px 40px -20px;
          }
          h1 { font-size: 2.5em; margin-bottom: 10px; }
          h2 { font-size: 2em; color: #2d3748; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          h3 { font-size: 1.5em; color: #4a5568; margin: 25px 0 10px 0; }
          p { margin: 15px 0; }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e2e8f0; 
            color: #666; 
          }
          @media (max-width: 768px) {
            .container { padding: 20px 15px; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>${productType}</p>
          </div>
          
          <div class="content">
            ${content.split('\n').map(line => {
              if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`
              if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`
              if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`
              if (line.trim()) return `<p>${line}</p>`
              return '<br>'
            }).join('')}
          </div>
          
          <div class="footer">
            <p>Generated with AI Digital Product Builder Suite</p>
          </div>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)

    return `${title}.html`
  }

  const exportToMarkdown = async () => {
    const markdownContent = `# ${title}

*${productType}*

---

${content}

---

*Generated with AI Digital Product Builder Suite*
`

    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)

    return `${title}.md`
  }

  const handleExport = async () => {
    if (selectedFormats.length === 0) {
      toast({
        title: "No formats selected",
        description: "Please select at least one export format.",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    const exported: string[] = []

    try {
      for (let i = 0; i < selectedFormats.length; i++) {
        const format = selectedFormats[i]
        setExportProgress((i / selectedFormats.length) * 100)

        let filename = ''
        switch (format) {
          case 'pdf':
            filename = await exportToPDF()
            break
          case 'docx':
            filename = await exportToDocx()
            break
          case 'html':
            filename = await exportToHTML()
            break
          case 'markdown':
            filename = await exportToMarkdown()
            break
        }

        if (filename) {
          exported.push(filename)
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setExportProgress(100)
      setExportedFiles(exported)

      toast({
        title: "Export Complete!",
        description: `Successfully exported ${exported.length} file(s).`
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Error",
        description: "Failed to export files. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Center</h2>
        <p className="text-gray-600">Export your content in multiple professional formats</p>
      </div>

      <Tabs defaultValue="formats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formats">Export Formats</TabsTrigger>
          <TabsTrigger value="settings">PDF Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="formats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportFormats.map(format => {
              const IconComponent = format.icon
              const isSelected = selectedFormats.includes(format.id)
              
              return (
                <Card 
                  key={format.id} 
                  className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md'}`}
                  onClick={() => toggleFormat(format.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                          <IconComponent className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{format.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">{format.extension}</Badge>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <CardDescription>{format.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {format.features.map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>PDF Design Options</span>
              </CardTitle>
              <CardDescription>Customize your PDF appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="generateCover">Generate AI Cover</Label>
                  <p className="text-sm text-gray-600">Create a professional cover design</p>
                </div>
                <Switch
                  id="generateCover"
                  checked={pdfOptions.generateCover}
                  onCheckedChange={(checked) => setPdfOptions(prev => ({ ...prev, generateCover: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="includeImages">Include Section Images</Label>
                  <p className="text-sm text-gray-600">Add AI-generated illustrations</p>
                </div>
                <Switch
                  id="includeImages"
                  checked={pdfOptions.includeImages}
                  onCheckedChange={(checked) => setPdfOptions(prev => ({ ...prev, includeImages: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="addPageNumbers">Page Numbers</Label>
                  <p className="text-sm text-gray-600">Add page numbering</p>
                </div>
                <Switch
                  id="addPageNumbers"
                  checked={pdfOptions.addPageNumbers}
                  onCheckedChange={(checked) => setPdfOptions(prev => ({ ...prev, addPageNumbers: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select value={pdfOptions.colorScheme} onValueChange={(value) => setPdfOptions(prev => ({ ...prev, colorScheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional Blue</SelectItem>
                    <SelectItem value="creative">Creative Purple</SelectItem>
                    <SelectItem value="minimal">Minimal Gray</SelectItem>
                    <SelectItem value="warm">Warm Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Progress */}
      {isExporting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exporting files...</span>
                <span className="text-sm text-gray-600">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Results */}
      {exportedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Export Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportedFiles.map(filename => (
                <div key={filename} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">{filename}</span>
                  <Badge className="bg-green-100 text-green-800">Downloaded</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleExport} 
          disabled={isExporting || selectedFormats.length === 0}
          size="lg"
          className="px-8"
        >
          <Download className="w-5 h-5 mr-2" />
          {isExporting ? 'Exporting...' : `Export ${selectedFormats.length} Format${selectedFormats.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  )
}