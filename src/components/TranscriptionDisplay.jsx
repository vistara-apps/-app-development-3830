import React, { useState } from 'react'
import { FileText, User, Building, Target, Clock, ChevronDown, ChevronUp, MessageSquare, BarChart3 } from 'lucide-react'
import { cn } from '../lib/utils'

const TranscriptionDisplay = ({ voiceNote, variant = 'detailed', className }) => {
  const [expandedSection, setExpandedSection] = useState('transcription')
  
  if (!voiceNote) return null

  const { transcription_text, extracted_entities, enriched_data } = voiceNote

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  if (variant === 'compact') {
    return (
      <div className={cn("card card-compact", className)}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-text-primary line-clamp-3">{transcription_text}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {extracted_entities?.contact && (
              <div className="badge badge-primary">
                <User className="h-3 w-3 mr-1" />
                <span>{extracted_entities.contact}</span>
              </div>
            )}
            
            {extracted_entities?.company && (
              <div className="badge badge-accent">
                <Building className="h-3 w-3 mr-1" />
                <span>{extracted_entities.company}</span>
              </div>
            )}
            
            {extracted_entities?.dealStage && (
              <div className="badge badge-success">
                <Target className="h-3 w-3 mr-1" />
                <span>{extracted_entities.dealStage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Sentiment color mapping
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'badge-success'
      case 'negative': return 'badge-error'
      case 'neutral': return 'badge-primary'
      default: return 'badge-primary'
    }
  }

  return (
    <div className={cn("card", className)}>
      <div className="space-y-6">
        {/* Transcription Section */}
        <div>
          <button 
            className="w-full flex items-center justify-between mb-2 focus:outline-none"
            onClick={() => toggleSection('transcription')}
            aria-expanded={expandedSection === 'transcription'}
          >
            <h3 className="text-lg font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
              <span>Transcription</span>
            </h3>
            {expandedSection === 'transcription' ? 
              <ChevronUp className="h-5 w-5 text-text-tertiary" /> : 
              <ChevronDown className="h-5 w-5 text-text-tertiary" />
            }
          </button>
          
          {expandedSection === 'transcription' && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
              <p className="text-text-primary leading-relaxed">{transcription_text}</p>
            </div>
          )}
        </div>

        {/* Extracted Information Section */}
        {extracted_entities && Object.keys(extracted_entities).length > 0 && (
          <div>
            <button 
              className="w-full flex items-center justify-between mb-2 focus:outline-none"
              onClick={() => toggleSection('entities')}
              aria-expanded={expandedSection === 'entities'}
            >
              <h4 className="text-md font-semibold flex items-center">
                <Target className="h-5 w-5 text-primary-500 mr-2" />
                <span>Extracted Information</span>
              </h4>
              {expandedSection === 'entities' ? 
                <ChevronUp className="h-5 w-5 text-text-tertiary" /> : 
                <ChevronDown className="h-5 w-5 text-text-tertiary" />
              }
            </button>
            
            {expandedSection === 'entities' && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extracted_entities.contact && (
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                      <div className="p-2 bg-primary-50 rounded-full">
                        <User className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Contact</span>
                        <p className="font-medium text-text-primary">{extracted_entities.contact}</p>
                      </div>
                    </div>
                  )}

                  {extracted_entities.company && (
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                      <div className="p-2 bg-accent-50 rounded-full">
                        <Building className="h-5 w-5 text-accent-500" />
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Company</span>
                        <p className="font-medium text-text-primary">{extracted_entities.company}</p>
                      </div>
                    </div>
                  )}

                  {extracted_entities.dealStage && (
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                      <div className="p-2 bg-success-50 rounded-full">
                        <Target className="h-5 w-5 text-success-500" />
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Deal Stage</span>
                        <p className="font-medium text-text-primary">{extracted_entities.dealStage}</p>
                      </div>
                    </div>
                  )}

                  {extracted_entities.nextSteps && (
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                      <div className="p-2 bg-warning-50 rounded-full">
                        <Clock className="h-5 w-5 text-warning-500" />
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Next Steps</span>
                        <p className="font-medium text-text-primary">{extracted_entities.nextSteps}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Insights Section */}
        {enriched_data && (
          <div>
            <button 
              className="w-full flex items-center justify-between mb-2 focus:outline-none"
              onClick={() => toggleSection('insights')}
              aria-expanded={expandedSection === 'insights'}
            >
              <h4 className="text-md font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 text-primary-500 mr-2" />
                <span>Additional Insights</span>
              </h4>
              {expandedSection === 'insights' ? 
                <ChevronUp className="h-5 w-5 text-text-tertiary" /> : 
                <ChevronDown className="h-5 w-5 text-text-tertiary" />
              }
            </button>
            
            {expandedSection === 'insights' && (
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-100 shadow-sm">
                {enriched_data.sentiment && (
                  <div className="mb-4">
                    <span className="text-sm text-text-secondary font-medium">Sentiment</span>
                    <div className="mt-1 flex items-center">
                      <span className={cn(
                        "badge",
                        getSentimentColor(enriched_data.sentiment)
                      )}>
                        {enriched_data.sentiment}
                      </span>
                    </div>
                  </div>
                )}
                
                {enriched_data.summary && (
                  <div>
                    <span className="text-sm text-text-secondary font-medium">Summary</span>
                    <div className="mt-1 bg-white p-3 rounded-md border border-primary-100">
                      <p className="text-text-primary">{enriched_data.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptionDisplay
