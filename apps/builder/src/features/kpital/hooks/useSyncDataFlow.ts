import assert from 'assert'
import { useState } from 'react'

import { useToast } from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useAuthKpital } from './useAuthKpital'
import { useCampaigns } from './useCampaigns'
import { InputsCampaign } from '../types/types'
import { useKpitalConnection } from './useExternalServerConnection'

export const useSyncDataFlow = (onClose: () => void) => {
  const { t } = useTranslate()
  const { typebot } = useTypebot()
  const toast = useToast()
  const { getToken } = useAuthKpital()
  const { campaigns } = useCampaigns()
  const { connections } = useKpitalConnection(typebot?.workspaceId || '')
  const [errors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [inputs, setInputs] = useState<InputsCampaign>({
    campaignId: '',
  })

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

    if (connections && connections.length > 0) {
      const token = await getToken(
        connections[0].url_backend,
        connections[0].user,
        connections[0].password
      )

      const response = await fetch(
        `${connections[0].url_backend}/api/callbox/flows/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        toast({
          position: 'top-right',
          title: t('SyncDataFlowDialog.successToast.title'),
          status: 'success',
        })
        onClose()
      } else {
        toast({
          position: 'top-right',
          title: t('SyncDataFlowDialog.errorToast.title'),
          status: 'error',
        })
      }
    }
  }
  return {
    inputs,
    setInputs,
    errors,
    isLoading,
    campaigns,
    handleSubmit,
  }
}
