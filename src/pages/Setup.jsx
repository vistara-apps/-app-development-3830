import React, { useState } from 'react'
import { useCRM } from '../contexts/CRMContext'
import CRMConnectForm from '../components/CRMConnectForm'
import StatusIndicator from '../components/StatusIndicator'
import { Building, Trash2, Edit, CheckCircle } from 'lucide-react'

const Setup = () => {
  const { crmIntegrations, removeCRMIntegration, updateCRMIntegration } = useCRM()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState(null)

  const handleCRMConnect = () => {
    setShowAddForm(false)
  }

  const handleToggleActive = async (integration) => {
    try {
      await updateCRMIntegration(integration.id, {
        is_active: !integration.is_active
      })
    } catch (error) {
      console.error('Error toggling CRM integration:', error)
    }
  }

  const handleDelete = async (integration) => {
    if (window.confirm(`Are you sure you want to remove the ${integration.crm_type} integration?`)) {
      try {
        await removeCRMIntegration(integration.id)
      } catch (error) {
        console.error('Error removing CRM integration:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">CRM Setup</h1>
        <p className="text-gray-600 mt-2">
          Connect and configure your CRM integrations to automatically sync voice note data.
        </p>
      </div>

      {/* Connected CRMs */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Connected CRMs</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add CRM Integration
          </button>
        </div>

        {crmIntegrations.length === 0 ? (
          <div className="card text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CRM integrations</h3>
            <p className="text-gray-600 mb-4">
              Connect your first CRM to start syncing voice note data automatically.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Connect First CRM
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {crmIntegrations.map((integration) => (
              <div key={integration.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">
                        {integration.crm_type}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Added {new Date(integration.created_at).toLocaleDateString()}
                      </p>
                      {integration.is_active ? (
                        <StatusIndicator 
                          status="synced" 
                          variant="compact"
                          message="Active and syncing"
                        />
                      ) : (
                        <StatusIndicator 
                          status="error" 
                          variant="compact"
                          message="Inactive"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(integration)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        integration.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {integration.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => setEditingIntegration(integration)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(integration)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-md hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add CRM Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-modal max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add CRM Integration</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <CRMConnectForm onSuccess={handleCRMConnect} />
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Sync Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-sync voice notes</h4>
              <p className="text-sm text-gray-600">
                Automatically sync voice notes to connected CRMs when processed
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary focus:ring-primary rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Create tasks for follow-ups</h4>
              <p className="text-sm text-gray-600">
                Automatically create tasks in CRM when next steps are identified
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary focus:ring-primary rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email notifications</h4>
              <p className="text-sm text-gray-600">
                Receive email notifications when sync fails or needs attention
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary focus:ring-primary rounded"
            />
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Getting API Keys</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-900">HubSpot</h4>
            <p className="text-blue-800">
              Go to Settings → Integrations → API Key. Your API key should have contacts, companies, and deals permissions.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Salesforce</h4>
            <p className="text-blue-800">
              Create a Connected App in Setup → App Manager. Use OAuth 2.0 with appropriate scopes for leads and contacts.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Pipedrive</h4>
            <p className="text-blue-800">
              Go to Settings → Personal → API. Generate a new API token with read/write permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setup