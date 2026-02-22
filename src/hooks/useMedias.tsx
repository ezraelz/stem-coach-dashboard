// hooks/useCourses.js
import { useState } from 'react'
import api from '../services/api'
import type { ErrorProps, FileCreateProps, FileProps, FileUpdateProps } from '../types/mediaTypes'
import { useParams } from 'react-router-dom'

export const useMedias = () => {
  const { id } = useParams<{id: string}>();
  const [media, setMedia] = useState<FileUpdateProps[]>([]);
  const [medias, setMedias] = useState<FileProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorProps | null>(null)

  const fetchMedias = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get('/lesson_files/')

      if (error) throw error

      setMedias(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching medias:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMediaDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Example with Supabase
      const res = await api.get(`/lesson_files/${id}/`)

      if (error) throw error

      setMedia(res.data)
    } catch (err) {
      setError(err)
      console.error('Error fetching media:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addMedias = async (categoryData: FileCreateProps) => {
    try {
      const { data } = await api.post('/lesson_files/', categoryData)

      if (error) throw error
      
      if (data?.[0]) {
        setMedias(prev => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Error adding file:', err)
    }
  }

  const updateMedia = async (mediaId: number, updates: Partial<FileUpdateProps>) => {
    try {
      const { data } = await api.put(`/lesson_files/${mediaId}/`, updates)
      
      if (error) throw error
      
      if (data?.[0]) {
        setMedias(prev => prev.map(file => 
          file.id === mediaId ? data[0] : file
        ))
      }
    } catch (err) {
      console.error('Error updating file:', err)
    }
  }

  const deleteMedia = async (mediaId: number) => {
    try {
      await api.delete(`/lesson_files/${mediaId}/`)
      
      if (error) throw error
      
      setMedias(prev => prev.filter(media => Number(media)!== mediaId))
    } catch (err) {
      console.error('Error deleting media:', err)
    }
  }
  

  return {
    medias,
    media,
    setMedia,
    isLoading,
    error,
    fetchMedias,
    refetch: fetchMedias,
    fetchMediaDetail,
    addMedias,
    updateMedia,
    deleteMedia,
  }
}