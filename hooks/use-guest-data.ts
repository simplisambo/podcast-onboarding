import { useState, useEffect } from 'react'
import { GuestData } from '@/lib/notion'

interface UseGuestDataReturn {
  guestData: GuestData | null
  loading: boolean
  error: string | null
}

export function useGuestData(lastName: string): UseGuestDataReturn {
  const [guestData, setGuestData] = useState<GuestData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lastName) {
      setGuestData(null)
      setError(null)
      return
    }

    const fetchGuestData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/guest/${encodeURIComponent(lastName)}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Guest not found in database')
          } else {
            setError('Failed to fetch guest data')
          }
          setGuestData(null)
          return
        }

        const data = await response.json()
        setGuestData(data)
      } catch (err) {
        console.error('Error fetching guest data:', err)
        setError('Failed to fetch guest data')
        setGuestData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGuestData()
  }, [lastName])

  return { guestData, loading, error }
} 