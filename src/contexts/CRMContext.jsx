import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const CRMContext = createContext({})

export const useCRM = () => {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider')
  }
  return context
}

export const CRMProvider = ({ children }) => {
  const { user } = useAuth()
  const [crmIntegrations, setCrmIntegrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCRMIntegrations()
    } else {
      setCrmIntegrations([])
      setLoading(false)
    }
  }, [user])

  const fetchCRMIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setCrmIntegrations(data || [])
    } catch (error) {
      console.error('Error fetching CRM integrations:', error)
      setCrmIntegrations([])
    } finally {
      setLoading(false)
    }
  }

  const addCRMIntegration = async (integration) => {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .insert([{
          user_id: user.id,
          ...integration
        }])
        .select()

      if (error) throw error
      setCrmIntegrations(prev => [...prev, ...data])
      return data[0]
    } catch (error) {
      console.error('Error adding CRM integration:', error)
      throw error
    }
  }

  const updateCRMIntegration = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setCrmIntegrations(prev => 
        prev.map(integration => 
          integration.id === id ? data[0] : integration
        )
      )
      return data[0]
    } catch (error) {
      console.error('Error updating CRM integration:', error)
      throw error
    }
  }

  const removeCRMIntegration = async (id) => {
    try {
      const { error } = await supabase
        .from('crm_integrations')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCrmIntegrations(prev => prev.filter(integration => integration.id !== id))
    } catch (error) {
      console.error('Error removing CRM integration:', error)
      throw error
    }
  }

  const value = {
    crmIntegrations,
    loading,
    addCRMIntegration,
    updateCRMIntegration,
    removeCRMIntegration,
    fetchCRMIntegrations,
  }

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  )
}