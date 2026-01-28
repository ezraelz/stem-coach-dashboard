// hooks/useCourses.js
import { useState, useEffect } from 'react'
import api from '../services/api'

interface LessonProps {
  id: number;
  title: string;
  category: string;
  instructor: string;
  duration: number;
  level: string;
  icon: string;
  color: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

interface LessonCreateProps {
  title: string;
  category: string;
  instructor: string;
  duration: number;
  level: string;
  icon: null | string;
  color: string;
    description: string;
    is_active: boolean;
}

interface ErrorProps {
  message: string;
}

export const useLessons = () => {
  const [lessons, setLessons] = useState<LessonProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/lessons/')

      if (error) throw error

      setLessons(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching lessons:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addLesson = async (lessonData: LessonCreateProps) => {
    try {
      const { data } = await api.post('/lessons/', lessonData)
      
      if (error) throw error
      
      if (data?.[0]) {
        setLessons(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding lesson:', err)
    }
  }

  const updateLesson = async (lessonId: number, updates: Partial<LessonCreateProps>) => {
    try {
      const { data } = await api.put(`/lessons/${lessonId}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setLessons(prev => prev.map(lesson => 
          lesson.id === lessonId ? data[0] : lesson
        ))
      }
    } catch (err) {
      console.error('Error updating lesson:', err)
    }
  }

  const deleteLesson = async (lessonId: number) => {
    try {
      await api.delete(`/lessons/${lessonId}/`)
      
      if (error) throw error
      
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
    } catch (err) {
      console.error('Error deleting lesson:', err)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  return {
    lessons,
    isLoading,
    error,
    refetch: fetchLessons,
    fetchLessons,
    addLesson,
    updateLesson,
    deleteLesson,
  }
}