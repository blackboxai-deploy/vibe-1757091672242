'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LogoData {
  svgContent: string
  companyName: string
  style: string
  colors: string[]
}

interface LogoPreviewProps {
  logoData: LogoData | null
  isGenerating: boolean
}

export function LogoPreview({ logoData, isGenerating }: LogoPreviewProps) {
   if (isGenerating) {
    return (
      <div className="space-y-4">
        <Card className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="text-center p-6">
            <div className="relative mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-slate-700 font-semibold text-lg">Creating Your Logo</p>
            <p className="text-slate-600 mt-2">Our AI is designing a unique logo for your brand...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!logoData) {
    return (
      <div className="space-y-4">
        <Card className="h-64 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300">
          <CardContent className="text-center p-6">
            <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">Your logo will appear here</p>
            <p className="text-sm text-slate-500 mt-2">Fill out the form and click "Generate Logo"</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isImageUrl = logoData.svgContent.startsWith('http')

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Logo Display */}
          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
            {isImageUrl ? (
              <img 
                src={logoData.svgContent}
                alt={`${logoData.companyName} logo`}
                className="max-h-full max-w-full object-contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                className="max-h-full max-w-full flex items-center justify-center"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
            )}
          </div>
          
          {/* Logo Info */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">{logoData.companyName}</h3>
              <Badge variant="secondary" className="capitalize">
                {logoData.style.replace('-', ' ')}
              </Badge>
            </div>
            
            {logoData.colors.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Colors:</span>
                <div className="flex space-x-2">
                  {logoData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Different Background Previews */}
      <div className="grid grid-cols-3 gap-3">
        {/* White Background */}
        <Card className="overflow-hidden">
          <CardContent className="p-3">
            <div className="h-20 bg-white border border-slate-200 rounded flex items-center justify-center p-2">
              {isImageUrl ? (
                <img 
                  src={logoData.svgContent}
                  alt={`${logoData.companyName} logo on white`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                  className="max-h-full max-w-full flex items-center justify-center text-xs"
                />
              )}
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">White</p>
          </CardContent>
        </Card>

        {/* Dark Background */}
        <Card className="overflow-hidden">
          <CardContent className="p-3">
            <div className="h-20 bg-slate-800 rounded flex items-center justify-center p-2">
              {isImageUrl ? (
                <img 
                  src={logoData.svgContent}
                  alt={`${logoData.companyName} logo on dark`}
                  className="max-h-full max-w-full object-contain"
                  style={{ filter: 'invert(1) brightness(0.9)' }}
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                  className="max-h-full max-w-full flex items-center justify-center text-xs"
                  style={{ filter: 'invert(1) brightness(0.9)' }}
                />
              )}
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">Dark</p>
          </CardContent>
        </Card>

        {/* Colored Background */}
        <Card className="overflow-hidden">
          <CardContent className="p-3">
            <div className="h-20 bg-blue-500 rounded flex items-center justify-center p-2">
              {isImageUrl ? (
                <img 
                  src={logoData.svgContent}
                  alt={`${logoData.companyName} logo on colored`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                  className="max-h-full max-w-full flex items-center justify-center text-xs"
                />
              )}
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">Colored</p>
          </CardContent>
        </Card>
      </div>

      {/* Size Previews */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium text-slate-800 mb-3">Size Variations</h4>
          <div className="flex items-center space-x-6 bg-slate-50 p-4 rounded-lg">
            {/* Large */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded border flex items-center justify-center p-2 mb-2">
                {isImageUrl ? (
                  <img 
                    src={logoData.svgContent}
                    alt={`${logoData.companyName} logo large`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                    className="max-h-full max-w-full flex items-center justify-center"
                    style={{ fontSize: '10px' }}
                  />
                )}
              </div>
              <p className="text-xs text-slate-500">Large</p>
            </div>

            {/* Medium */}
            <div className="text-center">
              <div className="w-10 h-10 bg-white rounded border flex items-center justify-center p-1 mb-2">
                {isImageUrl ? (
                  <img 
                    src={logoData.svgContent}
                    alt={`${logoData.companyName} logo medium`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                    className="max-h-full max-w-full flex items-center justify-center"
                    style={{ fontSize: '6px' }}
                  />
                )}
              </div>
              <p className="text-xs text-slate-500">Medium</p>
            </div>

            {/* Small */}
            <div className="text-center">
              <div className="w-6 h-6 bg-white rounded border flex items-center justify-center p-0.5 mb-2">
                {isImageUrl ? (
                  <img 
                    src={logoData.svgContent}
                    alt={`${logoData.companyName} logo small`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: logoData.svgContent }}
                    className="max-h-full max-w-full flex items-center justify-center"
                    style={{ fontSize: '4px' }}
                  />
                )}
              </div>
              <p className="text-xs text-slate-500">Small</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}