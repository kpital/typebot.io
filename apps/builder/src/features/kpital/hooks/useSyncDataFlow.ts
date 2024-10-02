import assert from 'assert'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useAuthKpital } from './useAuthKpital'
import { useCampaigns } from './useCampaigns'
import { useLocalStorageFlow } from './useLocalStorageFlow'

export const useSyncDataFlow = (onClose: () => void) => {
  const { t } = useTranslate()
  const { typebot } = useTypebot()
  const { data: session } = useSession()
  const toast = useToast()
  const { inputs, updateInputs } = useLocalStorageFlow(typebot?.id ?? '')

  const [isLoading, setIsLoading] = useState(false)
  const { token, getToken } = useAuthKpital()
  const { campaigns, fetchCampaigns, setCampaigns } = useCampaigns()

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      updateInputs({ [name]: value })
    },
    [updateInputs]
  )

  /**
   * This function is responsible for getting the list of campaigns
   * available for the user
   */
  const handleNext = async () => {
    setIsLoading(true)
    const user = session?.user?.email ?? ''
    const { token, error } = await getToken(user, inputs.password, inputs.url)

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
      await fetchCampaigns(inputs.url, token)
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

  return {
    inputs,
    isLoading,
    campaigns,
    handleInputChange,
    handleNext,
    handleSubmit,
  }
}
