// SVG Utility Functions for Logo Processing

export interface SVGInfo {
  width: number
  height: number
  viewBox: string | null
  isValid: boolean
}

export function parseSVGInfo(svgContent: string): SVGInfo {
  try {
    // Parse SVG attributes
    const widthMatch = svgContent.match(/width=['"]([\d.]+)['"]/)
    const heightMatch = svgContent.match(/height=['"]([\d.]+)['"]/)
    const viewBoxMatch = svgContent.match(/viewBox=['"]([\d\s.-]+)['"]/)

    const width = widthMatch ? parseFloat(widthMatch[1]) : 0
    const height = heightMatch ? parseFloat(heightMatch[1]) : 0
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : null

    return {
      width,
      height,
      viewBox,
      isValid: svgContent.includes('<svg') && svgContent.includes('</svg>')
    }
  } catch (error) {
    console.error('Error parsing SVG:', error)
    return {
      width: 0,
      height: 0,
      viewBox: null,
      isValid: false
    }
  }
}

export function optimizeSVG(svgContent: string): string {
  try {
    let optimized = svgContent

    // Remove XML declaration if present
    optimized = optimized.replace(/<\?xml[^>]*\?>\s*/gi, '')

    // Remove comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '')

    // Remove unnecessary whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim()

    // Ensure viewBox is present for scalability
    if (!optimized.includes('viewBox') && optimized.includes('<svg')) {
      const info = parseSVGInfo(optimized)
      if (info.width && info.height) {
        optimized = optimized.replace(
          '<svg',
          `<svg viewBox="0 0 ${info.width} ${info.height}"`
        )
      }
    }

    return optimized
  } catch (error) {
    console.error('Error optimizing SVG:', error)
    return svgContent
  }
}

export function scaleSVG(svgContent: string, targetSize: number): string {
  try {
    let scaled = svgContent

    // Update width and height attributes
    scaled = scaled.replace(/width=['"]([\d.]+)['"]/, `width="${targetSize}"`)
    scaled = scaled.replace(/height=['"]([\d.]+)['"]/, `height="${targetSize}"`)

    // If no width/height but has viewBox, add them
    if (!scaled.includes('width=') && scaled.includes('viewBox')) {
      scaled = scaled.replace('<svg', `<svg width="${targetSize}" height="${targetSize}"`)
    }

    return scaled
  } catch (error) {
    console.error('Error scaling SVG:', error)
    return svgContent
  }
}

export function addBackgroundToSVG(svgContent: string, backgroundColor: string): string {
  try {
    // Insert background rectangle after the opening svg tag
    const backgroundRect = `<rect width="100%" height="100%" fill="${backgroundColor}"/>`
    
    const svgTagEndIndex = svgContent.indexOf('>') + 1
    const withBackground = 
      svgContent.slice(0, svgTagEndIndex) + 
      backgroundRect + 
      svgContent.slice(svgTagEndIndex)

    return withBackground
  } catch (error) {
    console.error('Error adding background to SVG:', error)
    return svgContent
  }
}

export function validateSVG(svgContent: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!svgContent) {
    errors.push('SVG content is empty')
    return { isValid: false, errors }
  }

  if (!svgContent.includes('<svg')) {
    errors.push('Missing SVG opening tag')
  }

  if (!svgContent.includes('</svg>')) {
    errors.push('Missing SVG closing tag')
  }

  // Check for basic structure
  const svgTagMatch = svgContent.match(/<svg[^>]*>/i)
  if (svgTagMatch) {
    const svgTag = svgTagMatch[0]
    
    // Check for namespace
    if (!svgTag.includes('xmlns')) {
      errors.push('Missing XML namespace')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function createPlaceholderSVG(width: number = 200, height: number = 200, text: string = 'Logo'): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
      ${text}
    </text>
  </svg>`
}

export function extractColorsFromSVG(svgContent: string): string[] {
  const colors: Set<string> = new Set()

  try {
    // Extract hex colors
    const hexMatches = svgContent.match(/#[0-9A-Fa-f]{6}/g)
    if (hexMatches) {
      hexMatches.forEach(color => colors.add(color.toUpperCase()))
    }

    // Extract RGB colors
    const rgbMatches = svgContent.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g)
    if (rgbMatches) {
      rgbMatches.forEach(rgb => {
        const values = rgb.match(/\d+/g)
        if (values && values.length === 3) {
          const hex = '#' + values.map(v => parseInt(v).toString(16).padStart(2, '0')).join('')
          colors.add(hex.toUpperCase())
        }
      })
    }

    // Filter out common default colors
    const filtered = Array.from(colors).filter(color => 
      !['#000000', '#FFFFFF', '#000', '#FFF'].includes(color.toUpperCase())
    )

    return filtered.slice(0, 10) // Return max 10 colors
  } catch (error) {
    console.error('Error extracting colors from SVG:', error)
    return []
  }
}

export function generateSVGPreview(svgContent: string, backgroundColor: string = 'transparent'): string {
  try {
    const info = parseSVGInfo(svgContent)
    
    if (!info.isValid) {
      return createPlaceholderSVG(200, 200, 'Invalid SVG')
    }

    // Create preview with standardized size
    let preview = scaleSVG(svgContent, 200)
    
    if (backgroundColor !== 'transparent') {
      preview = addBackgroundToSVG(preview, backgroundColor)
    }

    return optimizeSVG(preview)
  } catch (error) {
    console.error('Error generating SVG preview:', error)
    return createPlaceholderSVG(200, 200, 'Preview Error')
  }
}

export function convertSVGToDataURL(svgContent: string): string {
  try {
    const optimized = optimizeSVG(svgContent)
    const encoded = encodeURIComponent(optimized)
    return `data:image/svg+xml;charset=UTF-8,${encoded}`
  } catch (error) {
    console.error('Error converting SVG to data URL:', error)
    return ''
  }
}