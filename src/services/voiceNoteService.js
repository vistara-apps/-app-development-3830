import { supabase } from '../lib/supabase'
import { transcribeAudio, extractEntities, enrichData } from './transcriptionService'
import { syncToCRM } from './crmService'

export const processVoiceNote = async (audioBlob, userId, crmIntegrations) => {
  try {
    // Step 1: Transcribe audio
    console.log('Transcribing audio...')
    const transcriptionText = await transcribeAudio(audioBlob)
    
    // Step 2: Extract entities
    console.log('Extracting entities...')
    const extractedEntities = await extractEntities(transcriptionText)
    
    // Step 3: Enrich data
    console.log('Enriching data...')
    const enrichedData = await enrichData(transcriptionText, extractedEntities)
    
    // Step 4: Store in database
    console.log('Storing in database...')
    const { data: voiceNote, error } = await supabase
      .from('voice_notes')
      .insert([{
        user_id: userId,
        transcription_text: transcriptionText,
        extracted_entities: extractedEntities,
        enriched_data: enrichedData,
        crm_sync_status: 'pending'
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Step 5: Sync to CRMs
    const syncResults = []
    for (const integration of crmIntegrations.filter(i => i.is_active)) {
      try {
        console.log(`Syncing to ${integration.crm_type}...`)
        const syncResult = await syncToCRM(voiceNote, integration)
        syncResults.push({
          crmType: integration.crm_type,
          success: true,
          result: syncResult
        })
      } catch (syncError) {
        console.error(`Failed to sync to ${integration.crm_type}:`, syncError)
        syncResults.push({
          crmType: integration.crm_type,
          success: false,
          error: syncError.message
        })
      }
    }
    
    // Update sync status
    const overallSuccess = syncResults.every(r => r.success)
    await supabase
      .from('voice_notes')
      .update({
        crm_sync_status: overallSuccess ? 'synced' : 'error',
        sync_results: syncResults
      })
      .eq('id', voiceNote.id)
    
    return {
      voiceNote: {
        ...voiceNote,
        crm_sync_status: overallSuccess ? 'synced' : 'error',
        sync_results: syncResults
      },
      syncResults
    }
    
  } catch (error) {
    console.error('Error processing voice note:', error)
    throw error
  }
}

export const getVoiceNotes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('voice_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching voice notes:', error)
    throw error
  }
}

export const deleteVoiceNote = async (id) => {
  try {
    const { error } = await supabase
      .from('voice_notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting voice note:', error)
    throw error
  }
}