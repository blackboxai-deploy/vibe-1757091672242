'use client'

import { useState } from 'react'
import { LogoGeneratorForm } from '@/components/LogoGeneratorFormStyled'
import { LogoPreview } from '@/components/LogoPreview'
import { ExportOptions } from '@/components/ExportOptions'

interface LogoData {
  svgContent: string
  companyName: string
  style: string
  colors: string[]
}

export default function Home() {
  const [generatedLogo, setGeneratedLogo] = useState<LogoData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleLogoGenerated = (logoData: LogoData) => {
    setGeneratedLogo(logoData)
    setIsGenerating(false)
  }

  const handleGenerationStart = () => {
    setIsGenerating(true)
    setGeneratedLogo(null)
  }

  const handleGenerationError = () => {
    setIsGenerating(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Vector Logo Generator
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            maxWidth: '42rem',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Create professional vector logos for your business using AI. 
            Just describe your company and choose your preferred style.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          maxWidth: '87.5rem',
          margin: '0 auto'
        }}>
          {/* Left Panel - Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#3b82f6',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                Company Information
              </h2>
              <LogoGeneratorForm
                onLogoGenerated={handleLogoGenerated}
                onGenerationStart={handleGenerationStart}
                onGenerationError={handleGenerationError}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Right Panel - Preview & Export */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Logo Preview */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#10b981',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                Logo Preview
              </h2>
              <LogoPreview 
                logoData={generatedLogo} 
                isGenerating={isGenerating}
              />
            </div>

            {/* Export Options */}
            {generatedLogo && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#8b5cf6',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                  Download Options
                </h2>
                <ExportOptions logoData={generatedLogo} />
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '64rem',
          margin: '4rem auto 0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '2px solid #93c5fd'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              AI-Powered
            </h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Advanced AI creates unique logos based on your company description
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: '#d1fae5',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '2px solid #86efac'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              Vector Format
            </h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Scalable SVG logos that look perfect at any size
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: '#ede9fe',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '2px solid #c4b5fd'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              Instant Download
            </h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Download in multiple formats: SVG, PNG, and various sizes
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(500px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}