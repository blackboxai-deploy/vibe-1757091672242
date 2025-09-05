import { NextRequest, NextResponse } from 'next/server'

const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions'
const DEFAULT_MODEL = 'replicate/black-forest-labs/flux-1.1-pro'

const AI_HEADERS = {
  'customerId': 'cus_Szde3rnRXMofEO',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
}

interface LogoGenerationRequest {
  prompt: string
  companyName: string
  style: string
  colorScheme: string
  customColors?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LogoGenerationRequest = await request.json()
    const { prompt, companyName, style, colorScheme, customColors } = body

    if (!prompt || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and companyName' },
        { status: 400 }
      )
    }

    // Enhanced prompt for logo generation
    const logoPrompt = `Create a professional vector-style logo design with the following specifications:

${prompt}

IMPORTANT REQUIREMENTS:
- Design should work well as a scalable vector logo
- Clean, professional appearance suitable for business use
- Simple geometric shapes and clear typography
- Balanced composition with proper proportions
- Should look great at both large and small sizes
- Modern, memorable, and distinctive design
- Avoid overly complex details that don't scale well

Style: ${style} (${getStyleDescription(style)})
Color scheme: ${colorScheme}${customColors ? ` with custom colors: ${customColors}` : ''}

Generate a high-quality logo design that captures the essence of "${companyName}" while being visually appealing and professional. The logo should be suitable for use across various media including websites, business cards, and signage.`

    // Make request to AI service
    const aiResponse = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: AI_HEADERS,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'user',
            content: logoPrompt
          }
        ]
      })
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI API Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate logo', details: errorText },
        { status: 500 }
      )
    }

    const aiResult = await aiResponse.json()
    
    // Extract the image URL from the AI response
    let imageUrl = ''
    if (aiResult.choices && aiResult.choices[0] && aiResult.choices[0].message) {
      const content = aiResult.choices[0].message.content
      
      // Try to extract URL from the response
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/i)
      if (urlMatch) {
        imageUrl = urlMatch[0]
      } else {
        // If no URL found, check if the entire content is a URL
        if (content.startsWith('http') && (content.includes('.jpg') || content.includes('.png') || content.includes('.webp'))) {
          imageUrl = content.trim()
        }
      }
    }

    if (!imageUrl) {
      console.error('No image URL found in AI response:', aiResult)
      return NextResponse.json(
        { error: 'Failed to extract image URL from AI response' },
        { status: 500 }
      )
    }

    // For now, we'll return the image URL as the SVG content
    // In a more advanced implementation, we could convert the image to SVG
    return NextResponse.json({
      success: true,
      svgContent: imageUrl,
      imageUrl: imageUrl,
      companyName,
      style,
      colorScheme,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: DEFAULT_MODEL,
        style: style,
        colorScheme: colorScheme
      }
    })

  } catch (error) {
    console.error('Logo generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    'minimalist': 'clean, simple, modern design with minimal elements',
    'corporate': 'professional, trustworthy, formal business appearance',
    'creative': 'artistic, unique, expressive with creative elements',
    'tech': 'futuristic, digital, innovative with modern tech aesthetics',
    'vintage': 'classic, retro, timeless with traditional elements',
    'playful': 'fun, energetic, colorful with dynamic elements'
  }
  
  return descriptions[style] || 'modern professional design'
}