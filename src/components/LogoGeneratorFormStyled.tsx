'use client'

import { useState } from 'react'

interface LogoGeneratorFormProps {
  onLogoGenerated: (logoData: any) => void
  onGenerationStart: () => void
  onGenerationError: () => void
  isGenerating: boolean
}

const logoStyles = [
  { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple, modern design' },
  { value: 'corporate', label: 'Corporate', description: 'Professional, trustworthy, formal' },
  { value: 'creative', label: 'Creative', description: 'Artistic, unique, expressive' },
  { value: 'tech', label: 'Tech/Modern', description: 'Futuristic, digital, innovative' },
  { value: 'vintage', label: 'Vintage', description: 'Classic, retro, timeless' },
  { value: 'playful', label: 'Playful', description: 'Fun, energetic, colorful' }
]

const colorSchemes = [
  { value: 'monochrome', label: 'Monochrome', colors: ['#000000', '#808080', '#FFFFFF'] },
  { value: 'blue-professional', label: 'Professional Blue', colors: ['#1E40AF', '#3B82F6', '#DBEAFE'] },
  { value: 'green-nature', label: 'Nature Green', colors: ['#059669', '#10B981', '#D1FAE5'] },
  { value: 'orange-energy', label: 'Energy Orange', colors: ['#EA580C', '#F97316', '#FED7AA'] },
  { value: 'purple-creative', label: 'Creative Purple', colors: ['#7C3AED', '#8B5CF6', '#DDD6FE'] },
  { value: 'red-bold', label: 'Bold Red', colors: ['#DC2626', '#EF4444', '#FECACA'] },
  { value: 'custom', label: 'Custom Colors', colors: [] }
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Food & Beverage',
  'Real Estate', 'Consulting', 'Manufacturing', 'Entertainment', 'Non-profit',
  'Fashion', 'Sports & Fitness', 'Travel', 'Automotive', 'Other'
]

export function LogoGeneratorForm({ 
  onLogoGenerated, 
  onGenerationStart, 
  onGenerationError, 
  isGenerating 
}: LogoGeneratorFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: '',
    style: '',
    colorScheme: '',
    customColors: '',
    additionalNotes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateSystemPrompt = () => {
    const selectedStyle = logoStyles.find(s => s.value === formData.style)
    const selectedColors = colorSchemes.find(c => c.value === formData.colorScheme)
    
    return `Create a professional vector-style logo design for "${formData.companyName}". 
Company description: ${formData.description}
Industry: ${formData.industry}
Style: ${selectedStyle?.label} - ${selectedStyle?.description}
Color scheme: ${selectedColors?.label || 'Custom colors'}
Additional requirements: ${formData.additionalNotes || 'None'}

Generate a clean, scalable logo design that would work well as an SVG vector format. Focus on:
- Professional appearance suitable for business use
- Simple geometric shapes that scale well
- Clear typography if text is included
- Balanced composition and proper proportions
- Colors that work well together
- Design should be memorable and distinctive
- Avoid overly complex details that don't scale well in vector format

The logo should capture the essence of the business while being visually appealing and professional.`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName.trim() || !formData.description.trim() || !formData.style || !formData.colorScheme) {
      alert('Please fill in all required fields')
      return
    }

    onGenerationStart()

    try {
      const prompt = generateSystemPrompt()
      
      console.log('Sending request with data:', {
        prompt: prompt.substring(0, 100) + '...',
        companyName: formData.companyName,
        style: formData.style,
        colorScheme: formData.colorScheme
      })

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          companyName: formData.companyName,
          style: formData.style,
          colorScheme: formData.colorScheme,
          customColors: formData.customColors
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to generate logo')
      }

      const result = await response.json()
      console.log('API Response:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'Logo generation failed')
      }

      onLogoGenerated({
        svgContent: result.svgContent || result.imageUrl,
        companyName: formData.companyName,
        style: formData.style,
        colors: colorSchemes.find(c => c.value === formData.colorScheme)?.colors || []
      })
    } catch (error) {
      console.error('Error generating logo:', error)
      onGenerationError()
      alert(`Failed to generate logo: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  const selectedColorScheme = colorSchemes.find(c => c.value === formData.colorScheme)
  const isFormValid = formData.companyName.trim() && formData.description.trim() && formData.style && formData.colorScheme

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Company Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="companyName" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Company Name *
          </label>
          <input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter your company name"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Company Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Company Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your company does, your values, target audience..."
            rows={4}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease-in-out'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Industry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="industry" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Industry
          </label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="">Select your industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry.toLowerCase()}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Logo Style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Logo Style *
          </label>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {logoStyles.map(style => (
              <div
                key={style.value}
                onClick={() => handleInputChange('style', style.value)}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  border: `2px solid ${formData.style === style.value ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: formData.style === style.value ? '#eff6ff' : 'white',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  if (formData.style !== style.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.style !== style.value) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {style.label}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.4' }}>
                    {style.description}
                  </p>
                </div>
                {formData.style === style.value && (
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.75rem',
                    flexShrink: 0
                  }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Color Scheme *
          </label>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {colorSchemes.map(scheme => (
              <div
                key={scheme.value}
                onClick={() => handleInputChange('colorScheme', scheme.value)}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  border: `2px solid ${formData.colorScheme === scheme.value ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: formData.colorScheme === scheme.value ? '#eff6ff' : 'white',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (formData.colorScheme !== scheme.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.colorScheme !== scheme.value) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>
                  {scheme.label}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {scheme.colors.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {scheme.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            backgroundColor: color,
                            borderRadius: '50%',
                            border: '1px solid #e5e7eb'
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  {formData.colorScheme === scheme.value && (
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        {formData.colorScheme === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="customColors" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              Custom Colors
            </label>
            <input
              id="customColors"
              type="text"
              value={formData.customColors}
              onChange={(e) => handleInputChange('customColors', e.target.value)}
              placeholder="Enter hex colors separated by commas (e.g., #FF0000, #00FF00)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        )}

        {/* Additional Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="additionalNotes" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Additional Requirements
          </label>
          <textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            placeholder="Any specific elements, symbols, or requirements for your logo..."
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease-in-out'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Color Preview */}
        {selectedColorScheme && selectedColorScheme.colors.length > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Selected Colors:
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {selectedColorScheme.colors.map((color, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: color,
                      borderRadius: '50%',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace'
                  }}>
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !isFormValid}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            backgroundColor: (isGenerating || !isFormValid) ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: (isGenerating || !isFormValid) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!isGenerating && isFormValid) {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating && isFormValid) {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }
          }}
        >
          {isGenerating ? (
            <>
              <div style={{
                width: '1rem',
                height: '1rem',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Generating Logo...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Generate Logo</span>
            </>
          )}
        </button>

        {/* Form Status */}
        {!isFormValid && (
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>Please fill in all required fields to generate your logo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {!formData.companyName.trim() && <div>• Company name is required</div>}
              {!formData.description.trim() && <div>• Company description is required</div>}
              {!formData.style && <div>• Logo style selection is required</div>}
              {!formData.colorScheme && <div>• Color scheme selection is required</div>}
            </div>
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}