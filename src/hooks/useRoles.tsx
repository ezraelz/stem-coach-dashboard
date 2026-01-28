// hooks/useCourses.js
import { useState } from 'react'
import api from '../services/api'

interface RoleProps {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface RoleCreateProps {
  name: string;
  description: string;
}

interface ErrorProps {
  message: string;
}

export const useRoles = () => {
  const [roles, setRoles] = useState<RoleProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/roles/')

      if (error) throw error
      
      setRoles(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching roles:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addRole = async (roleData: RoleCreateProps) => {
    try {
      const { data } = await api.post('/roles/', roleData)
      
      if (error) throw error
      
      if (data?.[0]) {
        setRoles(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding role:', err)
    }
  }

  const updateRoles = async (roleId: number, updates: Partial<RoleCreateProps>) => {
    try {
      const { data } = await api.put(`/roles/${roleId}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setRoles(prev => prev.map(role => 
          role.id === roleId ? data[0] : role
        ))
      }
    } catch (err) {
      console.error('Error updating role:', err)
    }
  }

  const deleteRole = async (roleId: number) => {
    try {
      await api.delete(`/roles/${roleId}/`)
      
      if (error) throw error
      
      setRoles(prev => prev.filter(role => role.id !== roleId))
    } catch (err) {
      console.error('Error deleting role:', err)
    }
  }

  

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    refetch: fetchRoles,
    addRole,
    updateRoles,
    deleteRole,
  }
}