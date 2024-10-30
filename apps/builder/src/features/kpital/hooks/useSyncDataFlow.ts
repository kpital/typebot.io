import assert from 'assert'
import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useAuthKpital } from './useAuthKpital'
import { useCampaigns } from './useCampaigns'
import { InputsSaveFlow } from '../types/types'
import { validateUrl } from '../utils/validateUrl'

export const useSyncDataFlow = (onClose: () => void) => {
  const { t } = useTranslate()
  const { typebot } = useTypebot()
  const { data: session } = useSession()
  const toast = useToast()
  const storageKey = `@kpital.flow:${typebot?.id}`

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [inputs, setInputsFields] = useState<InputsSaveFlow>({
    url: '',
    username: session?.user?.email ?? '',
    password: '',
    campaignId: '',
  })

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey)
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setInputsFields((prevInputs) => ({
          ...prevInputs,
          url: parsedData.url || '',
          username: (parsedData.user || session?.user?.email) ?? '',
          campaignId: parsedData.campaignId || '',
        }))
      } catch (error) {
        console.error('Error al analizar los datos almacenados:', error)
      }
    }
  }, [storageKey, session?.user?.email])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setInputsFields((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }))

      const newErrors: Record<string, string> = {}
      switch (name) {
        case 'url':
          if (!validateUrl(value)) {
            newErrors.url = 'URL no válida'
          }
          break
      }
      setErrors(newErrors)
    },
    []
  )

  const { token, getToken } = useAuthKpital()
  const { campaigns, fetchCampaigns, setCampaigns } = useCampaigns()

  /**
   * This function is responsible for getting the list of campaigns
   * available for the user
   */
  const handleNext = async () => {
    setIsLoading(true)
    const { token, error } = await getToken(
      inputs.username,
      inputs.password,
      inputs.url
    )

    if (error) {
      toast({
        position: 'top-right',
        title: t('SyncDataFlowDialog.errorToast.title'),
        status: 'error',
      })
      setIsLoading(false)
      return
    }

    // Get the campaigns available for the user
    if (token) {
      const campaigns = await fetchCampaigns(inputs.url, token)
      if (campaigns && campaigns.length === 0) {
        toast({
          position: 'top-right',
          title: t('SyncDataFlowDialog.emptyCampaigns.title'),
          status: 'success',
        })
      }
    }

    setIsLoading(false)
  }

  /**
   * This function is responsible for syncronizing
   * the data flow with the Skarlet API
   */
  const handleSubmit = async () => {
    setIsLoading(true)
    assert(typebot)

    await updateDataFlow(JSON.stringify(typebot))

    // Save inputs in local storage
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        user: inputs.username,
        url: inputs.url,
        campaignId: inputs.campaignId,
      })
    )
    setIsLoading(false)
  }

  const updateDataFlow = async (flow: string) => {
    assert(typebot)
    const data = {
      name: typebot.name,
      data: flow,
      campaign: inputs.campaignId,
    }

    const response = await fetch(`${inputs.url}/api/callbox/flows/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      toast({
        position: 'top-right',
        title: t('SyncDataFlowDialog.successToast.title'),
        status: 'success',
      })
      onClose()
    } else {
      setCampaigns([])
      toast({
        position: 'top-right',
        title: t('SyncDataFlowDialog.errorToast.title'),
        status: 'error',
      })
    }
  }

  const handleSaveSettings = async () => {
    console.log('saveSettings')
  }

  return {
    inputs,
    errors,
    isLoading,
    campaigns,
    handleInputChange,
    handleNext,
    handleSubmit,
    handleSaveSettings,
  }
}
