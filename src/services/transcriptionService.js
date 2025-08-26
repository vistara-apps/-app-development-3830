import { openai } from '../lib/openai'

export const transcribeAudio = async (audioBlob) => {
  try {
    // Convert blob to file
    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
    
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en'
    })

    return response.text
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export const extractEntities = async (transcriptionText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a sales CRM assistant. Extract key sales information from voice note transcriptions and return ONLY valid JSON with this exact structure:
{
  "contact": "Contact name if mentioned",
  "company": "Company name if mentioned", 
  "dealStage": "Deal stage or sales phase if mentioned",
  "nextSteps": "Next actions or follow-ups mentioned",
  "actionItems": ["Array of specific tasks mentioned"],
  "dealValue": "Any monetary value mentioned",
  "meetingDate": "Any future meeting dates mentioned"
}`
        },
        {
          role: 'user',
          content: `Extract sales information from this transcription: ${transcriptionText}`
        }
      ],
      temperature: 0.1
    })

    const content = response.choices[0].message.content
    
    try {
      return JSON.parse(content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error('Failed to parse extracted entities:', parseError)
      return {
        contact: null,
        company: null,
        dealStage: null,
        nextSteps: null,
        actionItems: [],
        dealValue: null,
        meetingDate: null
      }
    }
  } catch (error) {
    console.error('Entity extraction error:', error)
    throw new Error('Failed to extract entities')
  }
}

export const enrichData = async (transcriptionText, entities) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a sales analyst. Analyze the voice note and return ONLY valid JSON with this structure:
{
  "sentiment": "positive|neutral|negative",
  "summary": "Brief 1-2 sentence summary of the interaction",
  "priority": "high|medium|low",
  "confidence": "Confidence level of extracted data (0-100)"
}`
        },
        {
          role: 'user',
          content: `Analyze this sales interaction:
Transcription: ${transcriptionText}
Extracted entities: ${JSON.stringify(entities)}`
        }
      ],
      temperature: 0.1
    })

    const content = response.choices[0].message.content
    
    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse enriched data:', parseError)
      return {
        sentiment: 'neutral',
        summary: 'Voice note processed',
        priority: 'medium',
        confidence: 50
      }
    }
  } catch (error) {
    console.error('Data enrichment error:', error)
    throw new Error('Failed to enrich data')
  }
}