// AI Logo Generation Utility Functions

export interface LogoGenerationConfig {
  companyName: string
  description: string
  industry: string
  style: string
  colorScheme: string
  customColors?: string
  additionalNotes?: string
}

export interface LogoStyle {
  value: string
  label: string
  description: string
  aiPromptModifier: string
}

export interface ColorScheme {
  value: string
  label: string
  colors: string[]
  aiPromptModifier: string
}

export const LOGO_STYLES: LogoStyle[] = [
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean, simple, modern design',
    aiPromptModifier: 'minimalist design with clean lines, simple geometric shapes, plenty of white space, modern typography'
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Professional, trustworthy, formal',
    aiPromptModifier: 'corporate professional design, trustworthy appearance, formal business style, conservative colors'
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Artistic, unique, expressive',
    aiPromptModifier: 'creative artistic design, unique visual elements, expressive shapes, innovative composition'
  },
  {
    value: 'tech',
    label: 'Tech/Modern',
    description: 'Futuristic, digital, innovative',
    aiPromptModifier: 'modern tech design, futuristic elements, digital aesthetic, innovative geometric patterns'
  },
  {
    value: 'vintage',
    label: 'Vintage',
    description: 'Classic, retro, timeless',
    aiPromptModifier: 'vintage retro design, classic typography, timeless elements, traditional craftsmanship feel'
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Fun, energetic, colorful',
    aiPromptModifier: 'playful fun design, energetic elements, vibrant colors, dynamic composition'
  }
]

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    value: 'monochrome',
    label: 'Monochrome',
    colors: ['#000000', '#808080', '#FFFFFF'],
    aiPromptModifier: 'monochrome black and white design, grayscale palette, high contrast'
  },
  {
    value: 'blue-professional',
    label: 'Professional Blue',
    colors: ['#1E40AF', '#3B82F6', '#DBEAFE'],
    aiPromptModifier: 'professional blue color palette, trust and stability, corporate blue tones'
  },
  {
    value: 'green-nature',
    label: 'Nature Green',
    colors: ['#059669', '#10B981', '#D1FAE5'],
    aiPromptModifier: 'nature green color palette, growth and harmony, fresh green tones'
  },
  {
    value: 'orange-energy',
    label: 'Energy Orange',
    colors: ['#EA580C', '#F97316', '#FED7AA'],
    aiPromptModifier: 'energetic orange color palette, warmth and enthusiasm, vibrant orange tones'
  },
  {
    value: 'purple-creative',
    label: 'Creative Purple',
    colors: ['#7C3AED', '#8B5CF6', '#DDD6FE'],
    aiPromptModifier: 'creative purple color palette, innovation and creativity, rich purple tones'
  },
  {
    value: 'red-bold',
    label: 'Bold Red',
    colors: ['#DC2626', '#EF4444', '#FECACA'],
    aiPromptModifier: 'bold red color palette, strength and passion, powerful red tones'
  }
]

export function generateLogoPrompt(config: LogoGenerationConfig): string {
  const style = LOGO_STYLES.find(s => s.value === config.style)
  const colorScheme = COLOR_SCHEMES.find(c => c.value === config.colorScheme)

  const basePrompt = `Create a professional vector-style logo design for "${config.companyName}".

Company Details:
- Description: ${config.description}
- Industry: ${config.industry}
- Target aesthetic: ${style?.label || config.style}

Design Requirements:
- ${style?.aiPromptModifier || 'modern professional design'}
- ${colorScheme?.aiPromptModifier || 'balanced color palette'}
- ${config.customColors ? `Custom colors: ${config.customColors}` : ''}
- Vector-friendly design that scales well
- Clean, memorable, and distinctive
- Professional appearance suitable for business use
- Simple geometric shapes and clear composition
- Balanced proportions for various applications

${config.additionalNotes ? `Additional requirements: ${config.additionalNotes}` : ''}

Generate a high-quality logo that captures the essence of the business while being visually appealing and professionally appropriate. The design should work well across different media including digital platforms, print materials, and signage.`

  return basePrompt
}

export function validateLogoConfig(config: Partial<LogoGenerationConfig>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!config.companyName?.trim()) {
    errors.push('Company name is required')
  }

  if (!config.description?.trim()) {
    errors.push('Company description is required')
  }

  if (!config.style) {
    errors.push('Logo style is required')
  }

  if (!config.colorScheme) {
    errors.push('Color scheme is required')
  }

  if (config.colorScheme === 'custom' && !config.customColors?.trim()) {
    errors.push('Custom colors are required when custom color scheme is selected')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function sanitizeCompanyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateFilename(companyName: string, format: string): string {
  const sanitized = sanitizeCompanyName(companyName)
  const timestamp = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  
  const extensions: Record<string, string> = {
    'svg': 'svg',
    'png-512': 'png',
    'png-256': 'png',
    'png-128': 'png',
    'png-64': 'png'
  }

  const ext = extensions[format] || 'png'
  
  return `${sanitized}-logo-${timestamp}.${ext}`
}