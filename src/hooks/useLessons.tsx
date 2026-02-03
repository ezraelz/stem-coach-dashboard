// hooks/useCourses.js
import { useState } from 'react'
import api from '../services/api'
import type { ErrorProps, LessonCreateProps, LessonProps } from '../types/lessonTypes'
import { useParams } from 'react-router-dom'

export const useLessons = () => {
  const { id } = useParams();
  const [lessons, setLessons] = useState<LessonProps[]>([])
  const [lesson, setLesson] = useState<LessonProps>()
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
    } catch {
      setError({ message: 'Failed to fetch lessons' })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLessonDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get(`/lessons/${id}/`)

      if (error) throw error

      setLesson(res.data)
    } catch {
      setError({ message: 'Failed to fetch lesson' })
    } finally {
      setIsLoading(false)
    }
  }

  const addLesson = async (formData: FormData) => {
    try {
      const { data } = await api.post('/lessons/', formData)
      
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

  return {
    lessons,
    lesson,
    isLoading,
    error,
    setLesson,
    fetchLessonDetail,
    refetch: fetchLessons,
    fetchLessons,
    addLesson,
    updateLesson,
    deleteLesson,
  }
}