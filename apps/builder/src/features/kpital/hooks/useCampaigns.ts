import { useState, useCallback } from 'react'

type Campaign = {
  id: string
  name: string
  description: string
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async (baseUrl: string, token: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${baseUrl}/api/campaigns/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al obtener las campañas')
      }

      const data: Campaign[] = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error al obtener las campañas:', error)
      setError('Error al obtener las campañas. Por favor, intente de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { campaigns, setCampaigns, isLoading, error, fetchCampaigns }
}
