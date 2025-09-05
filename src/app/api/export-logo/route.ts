import { NextRequest, NextResponse } from 'next/server'

interface ExportRequest {
  svgContent: string
  format: string
  filename: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()
    const { svgContent, format, filename } = body

    if (!svgContent || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: svgContent and format' },
        { status: 400 }
      )
    }

    // Handle different export formats
    if (format === 'svg') {
      // For SVG, return the content directly
      return new Response(svgContent, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    // For PNG formats, we need to handle image URL or SVG conversion
    if (format.startsWith('png-')) {
      // If svgContent is an image URL, fetch and return it
      if (svgContent.startsWith('http')) {
        try {
          // Fetch the image
          const imageResponse = await fetch(svgContent)
          if (!imageResponse.ok) {
            throw new Error('Failed to fetch image')
          }

          const imageBuffer = await imageResponse.arrayBuffer()
          
          // Return the original image
          return new Response(imageBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          })
        } catch (error) {
          console.error('Error fetching image:', error)
          return NextResponse.json(
            { error: 'Failed to process image for export' },
            { status: 500 }
          )
        }
      }

      // If it's actual SVG content, we would need a more complex conversion
      // For now, return an error for actual SVG to PNG conversion
      return NextResponse.json(
        { error: 'SVG to PNG conversion not implemented in this demo' },
        { status: 501 }
      )
    }

    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}