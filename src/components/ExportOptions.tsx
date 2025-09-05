'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LogoData {
  svgContent: string
  companyName: string
  style: string
  colors: string[]
}

interface ExportOptionsProps {
  logoData: LogoData
}

const exportFormats = [
  { value: 'svg', label: 'SVG', description: 'Vector format (recommended)', extension: 'svg' },
  { value: 'png-512', label: 'PNG - 512x512', description: 'High resolution PNG', extension: 'png' },
  { value: 'png-256', label: 'PNG - 256x256', description: 'Medium resolution PNG', extension: 'png' },
  { value: 'png-128', label: 'PNG - 128x128', description: 'Small size PNG', extension: 'png' },
  { value: 'png-64', label: 'PNG - 64x64', description: 'Icon size PNG', extension: 'png' }
]

export function ExportOptions({ logoData }: ExportOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState('svg')
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async (format: string) => {
    setIsExporting(true)
    
    try {
      const selectedFormatData = exportFormats.find(f => f.value === format)
      const filename = `${logoData.companyName.toLowerCase().replace(/\s+/g, '-')}-logo.${selectedFormatData?.extension}`

      if (format === 'svg') {
        // Handle SVG download
        let svgContent = logoData.svgContent
        
        // If it's an image URL, we need to convert it or download it directly
        if (logoData.svgContent.startsWith('http')) {
          // For image URLs, we'll trigger a direct download
          const link = document.createElement('a')
          link.href = logoData.svgContent
          link.download = filename.replace('.svg', '.png') // Image URLs are typically PNG
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setIsExporting(false)
          return
        }

        // For actual SVG content
        const blob = new Blob([svgContent], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // Handle PNG downloads with different sizes
        const response = await fetch('/api/export-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            svgContent: logoData.svgContent,
            format: format,
            filename: filename
          }),
        })

        if (!response.ok) {
          throw new Error('Export failed')
        }

        // Handle the download
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export logo. Please try again.')
    }

    setIsExporting(false)
  }

  const handleDownloadAll = async () => {
    setIsExporting(true)
    
    try {
      // Download all formats one by one
      for (const format of exportFormats) {
        await handleDownload(format.value)
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('Bulk export failed:', error)
      alert('Failed to export all formats. Please try individual downloads.')
    }
    
    setIsExporting(false)
  }

  const selectedFormatData = exportFormats.find(f => f.value === selectedFormat)

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Select Format</label>
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {exportFormats.map(format => (
              <SelectItem key={format.value} value={format.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{format.label}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {format.extension.toUpperCase()}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedFormatData && (
          <p className="text-sm text-slate-500">{selectedFormatData.description}</p>
        )}
      </div>

      {/* Download Buttons */}
      <div className="space-y-3">
        <Button
          onClick={() => handleDownload(selectedFormat)}
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download {selectedFormatData?.extension.toUpperCase()}</span>
            </div>
          )}
        </Button>

        <Button
          onClick={handleDownloadAll}
          disabled={isExporting}
          variant="outline"
          className="w-full"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              <span>Exporting All...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Download All Formats</span>
            </div>
          )}
        </Button>
      </div>

      {/* Format Information */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-slate-800 mb-3">Format Guide</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Badge variant="secondary" className="text-xs mt-0.5">SVG</Badge>
              <div>
                <p className="text-slate-700 font-medium">Best for: Websites, print, scaling</p>
                <p className="text-slate-500">Vector format that scales to any size without quality loss</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="secondary" className="text-xs mt-0.5">PNG</Badge>
              <div>
                <p className="text-slate-700 font-medium">Best for: Social media, presentations</p>
                <p className="text-slate-500">Bitmap format with transparency support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2">Usage Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use SVG for websites and applications</li>
            <li>• Use PNG-512 for high-quality print materials</li>
            <li>• Use PNG-64 for favicons and small icons</li>
            <li>• Test your logo on different backgrounds</li>
            <li>• Keep the original SVG for future edits</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}