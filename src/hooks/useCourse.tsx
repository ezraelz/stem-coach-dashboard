// hooks/useCourses.js
import { useState, useEffect } from 'react'
import api from '../services/api'

interface CourseProps {
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

interface CourseCreateProps {
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

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/courses/')

      if (error) throw error
      
      setCourses(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching courses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addCourse = async (courseData: CourseCreateProps) => {
    try {
      const { data } = await api.post('/courses/', courseData)
      
      if (error) throw error
      
      if (data?.[0]) {
        setCourses(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding course:', err)
    }
  }

  const updateCourse = async (courseId: number, updates: Partial<CourseCreateProps>) => {
    try {
      const { data } = await api.put(`/courses/${courseId}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setCourses(prev => prev.map(course => 
          course.id === courseId ? data[0] : course
        ))
      }
    } catch (err) {
      console.error('Error updating course:', err)
    }
  }

  const deleteCourse = async (courseId: number) => {
    try {
      await api.delete(`/courses/${courseId}/`)
      
      if (error) throw error
      
      setCourses(prev => prev.filter(course => course.id !== courseId))
    } catch (err) {
      console.error('Error deleting course:', err)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
  }
}