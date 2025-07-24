import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

export interface ExportProject {
  id: string
  title: string
  content: string
  type: string
  createdAt: string | Date
  metadata?: Record<string, any>
}

export interface ExportOptions {
  includeImages?: boolean
  includeMetadata?: boolean
  optimizeForPrint?: boolean
}

// Helper function to safely format dates
const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'Unknown Date'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

// Helper function to safely get project type
const getProjectType = (type: string | null | undefined): string => {
  if (!type || type === 'undefined' || type === 'null') return 'Digital Product'
  return type
}

// Helper function to safely get project title
const getProjectTitle = (title: string | null | undefined): string => {
  if (!title || title === 'undefined' || title === 'null') return 'Untitled Project'
  return title
}

// Helper function to safely get project content
const getProjectContent = (content: string | null | undefined): string => {
  if (!content || content === 'undefined' || content === 'null') return 'No content available'
  return content
}

// PDF Export
export const exportToPDF = async (project: ExportProject, options: ExportOptions = {}) => {
  try {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - (margin * 2)
    
    const safeTitle = getProjectTitle(project.title)
    const safeContent = getProjectContent(project.content)
    const safeType = getProjectType(project.type)
    const safeDate = formatDate(project.createdAt)
    
    // Add title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text(safeTitle, margin, 30)
    
    // Add metadata if requested
    let yPosition = 50
    if (options.includeMetadata) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Type: ${safeType}`, margin, yPosition)
      yPosition += 10
      pdf.text(`Created: ${safeDate}`, margin, yPosition)
      yPosition += 20
    }
    
    // Add content
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    
    // Split content into lines that fit the page width
    const lines = pdf.splitTextToSize(safeContent, maxWidth)
    
    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(lines[i], margin, yPosition)
      yPosition += 7
    }
    
    // Add page numbers
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 10)
    }
    
    // Save the PDF
    const filename = safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    pdf.save(`${filename}.pdf`)
    return { success: true, message: 'PDF exported successfully' }
  } catch (error) {
    console.error('PDF export error:', error)
    return { success: false, message: `Failed to export PDF: ${error.message}` }
  }
}

// DOCX Export (simplified - creates a formatted text file with .docx extension)
export const exportToDOCX = async (project: ExportProject, options: ExportOptions = {}) => {
  try {
    const safeTitle = getProjectTitle(project.title)
    const safeContent = getProjectContent(project.content)
    const safeType = getProjectType(project.type)
    const safeDate = formatDate(project.createdAt)
    
    let content = `${safeTitle}\n\n`
    
    if (options.includeMetadata) {
      content += `Type: ${safeType}\n`
      content += `Created: ${safeDate}\n\n`
    }
    
    content += safeContent
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const filename = safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    saveAs(blob, `${filename}.docx`)
    
    return { success: true, message: 'DOCX exported successfully' }
  } catch (error) {
    console.error('DOCX export error:', error)
    return { success: false, message: `Failed to export DOCX: ${error.message}` }
  }
}

// HTML Export
export const exportToHTML = async (project: ExportProject, options: ExportOptions = {}) => {
  try {
    const safeTitle = getProjectTitle(project.title)
    const safeContent = getProjectContent(project.content)
    const safeType = getProjectType(project.type)
    const safeDate = formatDate(project.createdAt)
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #6366F1;
            border-bottom: 2px solid #6366F1;
            padding-bottom: 10px;
        }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
        }
        .content {
            white-space: pre-wrap;
            line-height: 1.8;
        }
        @media print {
            body { margin: 0; padding: 15px; }
        }
    </style>
</head>
<body>
    <h1>${safeTitle}</h1>
    ${options.includeMetadata ? `
    <div class="metadata">
        <strong>Type:</strong> ${safeType}<br>
        <strong>Created:</strong> ${safeDate}
    </div>
    ` : ''}
    <div class="content">${safeContent.replace(/\n/g, '<br>')}</div>
</body>
</html>`
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const filename = safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    saveAs(blob, `${filename}.html`)
    
    return { success: true, message: 'HTML exported successfully' }
  } catch (error) {
    console.error('HTML export error:', error)
    return { success: false, message: `Failed to export HTML: ${error.message}` }
  }
}

// Markdown Export
export const exportToMarkdown = async (project: ExportProject, options: ExportOptions = {}) => {
  try {
    const safeTitle = getProjectTitle(project.title)
    const safeContent = getProjectContent(project.content)
    const safeType = getProjectType(project.type)
    const safeDate = formatDate(project.createdAt)
    
    let content = `# ${safeTitle}\n\n`
    
    if (options.includeMetadata) {
      content += `**Type:** ${safeType}  \n`
      content += `**Created:** ${safeDate}\n\n`
      content += '---\n\n'
    }
    
    content += safeContent
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const filename = safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    saveAs(blob, `${filename}.md`)
    
    return { success: true, message: 'Markdown exported successfully' }
  } catch (error) {
    console.error('Markdown export error:', error)
    return { success: false, message: `Failed to export Markdown: ${error.message}` }
  }
}

// Text Export
export const exportToText = async (project: ExportProject, options: ExportOptions = {}) => {
  try {
    const safeTitle = getProjectTitle(project.title)
    const safeContent = getProjectContent(project.content)
    const safeType = getProjectType(project.type)
    const safeDate = formatDate(project.createdAt)
    
    let content = `${safeTitle}\n${'='.repeat(safeTitle.length)}\n\n`
    
    if (options.includeMetadata) {
      content += `Type: ${safeType}\n`
      content += `Created: ${safeDate}\n\n`
    }
    
    content += safeContent
    
    const blob = new Blob([content], { type: 'text/plain' })
    const filename = safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    saveAs(blob, `${filename}.txt`)
    
    return { success: true, message: 'Text file exported successfully' }
  } catch (error) {
    console.error('Text export error:', error)
    return { success: false, message: `Failed to export text file: ${error.message}` }
  }
}

// Main export function
export const exportProject = async (
  project: ExportProject, 
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'text',
  options: ExportOptions = {}
) => {
  // Validate project data
  if (!project) {
    return { success: false, message: 'No project data provided' }
  }

  switch (format) {
    case 'pdf':
      return await exportToPDF(project, options)
    case 'docx':
      return await exportToDOCX(project, options)
    case 'html':
      return await exportToHTML(project, options)
    case 'markdown':
      return await exportToMarkdown(project, options)
    case 'text':
      return await exportToText(project, options)
    default:
      return { success: false, message: 'Unsupported export format' }
  }
}

// Get export history from localStorage
export const getExportHistory = () => {
  try {
    const history = localStorage.getItem('exportHistory')
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error getting export history:', error)
    return []
  }
}

// Save export to history
export const saveExportToHistory = (exportData: {
  projectId: string
  projectTitle: string
  format: string
  timestamp: string
  success: boolean
  message: string
}) => {
  try {
    const history = getExportHistory()
    history.unshift(exportData)
    // Keep only last 50 exports
    const trimmedHistory = history.slice(0, 50)
    localStorage.setItem('exportHistory', JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error('Error saving export history:', error)
  }
}