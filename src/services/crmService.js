// CRM Service for syncing data to different CRM platforms
export const syncToCRM = async (voiceNote, crmIntegration) => {
  const { crm_type, api_key, settings } = crmIntegration
  
  try {
    switch (crm_type) {
      case 'hubspot':
        return await syncToHubSpot(voiceNote, api_key, settings)
      case 'salesforce':
        return await syncToSalesforce(voiceNote, api_key, settings)
      case 'pipedrive':
        return await syncToPipedrive(voiceNote, api_key, settings)
      default:
        throw new Error(`Unsupported CRM type: ${crm_type}`)
    }
  } catch (error) {
    console.error(`CRM sync error for ${crm_type}:`, error)
    throw error
  }
}

const syncToHubSpot = async (voiceNote, apiKey, settings) => {
  const { extracted_entities, enriched_data, transcription_text } = voiceNote
  
  // Mock HubSpot API call (in real implementation, would make actual API calls)
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000))
  await mockDelay()
  
  const contactData = {
    properties: {
      email: extracted_entities?.email || 'unknown@example.com',
      firstname: extracted_entities?.contact?.split(' ')[0] || 'Unknown',
      lastname: extracted_entities?.contact?.split(' ').slice(1).join(' ') || 'Contact',
      company: extracted_entities?.company || '',
      notes: transcription_text,
      dealstage: extracted_entities?.dealStage || 'initial_contact'
    }
  }
  
  console.log('Would sync to HubSpot:', contactData)
  
  return {
    success: true,
    contactId: 'hubspot_' + Date.now(),
    message: 'Successfully synced to HubSpot'
  }
}

const syncToSalesforce = async (voiceNote, apiKey, settings) => {
  const { extracted_entities, enriched_data, transcription_text } = voiceNote
  
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1200))
  await mockDelay()
  
  const leadData = {
    FirstName: extracted_entities?.contact?.split(' ')[0] || 'Unknown',
    LastName: extracted_entities?.contact?.split(' ').slice(1).join(' ') || 'Contact',
    Company: extracted_entities?.company || 'Unknown Company',
    Description: transcription_text,
    Status: extracted_entities?.dealStage || 'Open - Not Contacted'
  }
  
  console.log('Would sync to Salesforce:', leadData)
  
  return {
    success: true,
    leadId: 'sf_' + Date.now(),
    message: 'Successfully synced to Salesforce'
  }
}

const syncToPipedrive = async (voiceNote, apiKey, settings) => {
  const { extracted_entities, enriched_data, transcription_text } = voiceNote
  
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800))
  await mockDelay()
  
  const personData = {
    name: extracted_entities?.contact || 'Unknown Contact',
    org_name: extracted_entities?.company || 'Unknown Organization',
    notes: transcription_text
  }
  
  console.log('Would sync to Pipedrive:', personData)
  
  return {
    success: true,
    personId: 'pd_' + Date.now(),
    message: 'Successfully synced to Pipedrive'
  }
}