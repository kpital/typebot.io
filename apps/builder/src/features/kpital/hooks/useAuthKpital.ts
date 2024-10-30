import { useState } from 'react'

type TokenResponse = {
  access: string
  refresh: string
}

export const useAuthKpital = () => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getToken = async (
    baseUrl: string,
    user: string,
    password: string
  ): Promise<{ token: string | null; error: string | null }> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${baseUrl}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: password,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al obtener el token')
      }

      const data: TokenResponse = await response.json()
      setToken(data.access)
      return { token: data.access, error: null }
    } catch (error) {
      console.error('Error al obtener el token:', error)
      setError('Error al obtener el token. Por favor, intente de nuevo.')
      return {
        token: null,
        error: 'Error al obtener el token. Por favor, intente de nuevo.',
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { token, isLoading, error, getToken }
}
