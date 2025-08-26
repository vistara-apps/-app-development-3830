import React from 'react'
import { FileText, User, Building, Target, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

const TranscriptionDisplay = ({ voiceNote, variant = 'detailed', className }) => {
  if (!voiceNote) return null

  const { transcription_text, extracted_entities, enriched_data } = voiceNote

  if (variant === 'compact') {
    return (
      <div className={cn("card", className)}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 line-clamp-3">{transcription_text}</p>
          </div>
          {extracted_entities?.contact && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{extracted_entities.contact}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("card", className)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Transcription</span>
          </h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-text leading-relaxed">{transcription_text}</p>
          </div>
        </div>

        {extracted_entities && (
          <div>
            <h4 className="text-md font-semibold mb-3">Extracted Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extracted_entities.contact && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Contact:</span>
                    <p className="font-medium">{extracted_entities.contact}</p>
                  </div>
                </div>
              )}

              {extracted_entities.company && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Company:</span>
                    <p className="font-medium">{extracted_entities.company}</p>
                  </div>
                </div>
              )}

              {extracted_entities.dealStage && (
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Deal Stage:</span>
                    <p className="font-medium">{extracted_entities.dealStage}</p>
                  </div>
                </div>
              )}

              {extracted_entities.nextSteps && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Next Steps:</span>
                    <p className="font-medium">{extracted_entities.nextSteps}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {enriched_data && (
          <div>
            <h4 className="text-md font-semibold mb-3">Additional Insights</h4>
            <div className="bg-blue-50 rounded-md p-4">
              {enriched_data.sentiment && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Sentiment:</span>
                  <span className={cn(
                    "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                    enriched_data.sentiment === 'positive' && "bg-green-100 text-green-800",
                    enriched_data.sentiment === 'negative' && "bg-red-100 text-red-800",
                    enriched_data.sentiment === 'neutral' && "bg-gray-100 text-gray-800"
                  )}>
                    {enriched_data.sentiment}
                  </span>
                </div>
              )}
              {enriched_data.summary && (
                <div>
                  <span className="text-sm text-gray-500">Summary:</span>
                  <p className="text-sm mt-1">{enriched_data.summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptionDisplay