import React, { useState } from 'react'
import { useCRM } from '../contexts/CRMContext'
import { Building, Key, Settings } from 'lucide-react'

const CRMConnectForm = ({ onSuccess }) => {
  const { addCRMIntegration } = useCRM()
  const [formData, setFormData] = useState({
    crmType: '',
    apiKey: '',
    settings: {}
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const crmOptions = [
    { value: 'hubspot', label: 'HubSpot', description: 'Connect to your HubSpot CRM' },
    { value: 'salesforce', label: 'Salesforce', description: 'Connect to your Salesforce org' },
    { value: 'pipedrive', label: 'Pipedrive', description: 'Connect to your Pipedrive account' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await addCRMIntegration({
        crm_type: formData.crmType,
        api_key: formData.apiKey,
        settings: formData.settings,
        is_active: true
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err.message || 'Failed to connect CRM')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Building className="h-5 w-5 text-primary" />
            <span>Connect Your CRM</span>
          </h3>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CRM Platform
          </label>
          <div className="space-y-3">
            {crmOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  checked={formData.crmType === option.value}
                  onChange={(e) => handleInputChange('crmType', e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {formData.crmType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="input"
              placeholder={`Enter your ${crmOptions.find(o => o.value === formData.crmType)?.label} API key`}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Your API key is encrypted and stored securely. We only use it to sync your voice notes.
            </p>
          </div>
        )}

        {formData.crmType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Settings className="h-4 w-4 inline mr-2" />
              Additional Settings (Optional)
            </label>
            <textarea
              value={JSON.stringify(formData.settings, null, 2)}
              onChange={(e) => {
                try {
                  const settings = JSON.parse(e.target.value)
                  handleInputChange('settings', settings)
                } catch {
                  // Invalid JSON, keep as string
                }
              }}
              className="input h-24"
              placeholder='{"defaultOwner": "user@example.com"}'
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter JSON configuration for advanced CRM settings.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.crmType || !formData.apiKey}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connecting...' : 'Connect CRM'}
        </button>
      </form>
    </div>
  )
}

export default CRMConnectForm