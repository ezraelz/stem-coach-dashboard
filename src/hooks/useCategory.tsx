// hooks/useCourses.js
import { useState } from 'react'
import api from '../services/api'
import type { CategoryCreateProps, CategoryProps, ErrorProps } from '../types/categoryTypes'

export const useCategory = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/categories/')

      if (error) throw error

      setCategories(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching roles:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addCategory = async (categoryData: CategoryCreateProps) => {
    try {
      const { data } = await api.post('/categories/', categoryData)

      if (error) throw error
      
      if (data?.[0]) {
        setCategories(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding category:', err)
    }
  }

  const updateCategory = async (categoryId: number, updates: Partial<CategoryCreateProps>) => {
    try {
      const { data } = await api.put(`/categories/${categoryId}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setCategories(prev => prev.map(category => 
          category.id === categoryId ? data[0] : category
        ))
      }
    } catch (err) {
      console.error('Error updating category:', err)
    }
  }

  const deleteCategory = async (categoryId: number) => {
    try {
      await api.delete(`/categories/${categoryId}/`)
      
      if (error) throw error
      
      setCategories(prev => prev.filter(category => category.id !== categoryId))
    } catch (err) {
      console.error('Error deleting category:', err)
    }
  }

  

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    refetch: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}