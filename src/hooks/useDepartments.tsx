// hooks/useCourses.js
import { useState } from 'react'
import api from '../services/api'
import type { DepartmentCreateProps, DepartmentProps, ErrorProps } from '../types/departmentTypes'

export const useDepartments = () => {
  const [departments, setDepartments] = useState<DepartmentProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/departments/')

      if (error) throw error

      setDepartments(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching departments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addDepartments = async (DepartmentData: DepartmentCreateProps) => {
    try {
      const { data } = await api.post('/departments/', DepartmentData)

      if (error) throw error
      
      if (data?.[0]) {
        setDepartments(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding department:', err)
    }
  }

  const updateDepartment = async (Id: number, updates: Partial<DepartmentCreateProps>) => {
    try {
      const { data } = await api.put(`/lesson_files/${Id}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setDepartments(prev => prev.map(department => 
          department.id === Id ? data[0] : department
        ))
      }
    } catch (err) {
      console.error('Error updating department:', err)
    }
  }

  const deleteDepartment = async (Id: number) => {
    try {
      await api.delete(`/departments/${Id}/`)
      
      if (error) throw error
      
      setDepartments(prev => prev.filter(department => Number(department)!== Id))
    } catch (err) {
      console.error('Error deleting department:', err)
    }
  }
  

  return {
    departments,
    isLoading,
    error,
    fetchDepartments,
    refetch: fetchDepartments,
    addDepartments,
    updateDepartment,
    deleteDepartment,
  }
}