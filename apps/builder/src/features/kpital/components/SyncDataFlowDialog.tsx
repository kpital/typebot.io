import React, { useState } from 'react'
import assert from 'assert'
import { useTranslate } from '@tolgee/react'
import { useSession } from 'next-auth/react'
import { useCampaigns } from '@/features/kpital/hooks/useCampaingns'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useToast,
  VStack,
  Select,
} from '@chakra-ui/react'

import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useAuthKpital } from '@/features/kpital/hooks/useAuthKpital'

export type SyncDataFlowProps = {
  isOpen: boolean
  onClose: () => void
}

export const SyncDataFlowDialog = ({ isOpen, onClose }: SyncDataFlowProps) => {
  const { t } = useTranslate()
  const { typebot } = useTypebot()
  const { data: session } = useSession()
  const toast = useToast()

  // Estado del formulario
  const [inputs, setInputs] = useState({
    url: 'http://localhost:8000',
    password: 'bkt791125',
    campaignId: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dataFlow, setDataFlow] = useState<string | null>(null)
  const { token, getToken } = useAuthKpital()
  const { fetchCampaigns, campaigns, setCampaigns } = useCampaigns()

  // Manejador de cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }

  /**
   * Esta función es responsable de obtener el listado de campañas
   * disponibles para el usuario
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

    // Obtenemos las campañas disponibles para el usuario
    if (token) {
      await fetchCampaigns(inputs.url, token)
    }
    setIsLoading(false)
  }

  /**
   * Esta función es responsable de syncronizar
   * el flujo de datos con la API de Skarlet
   */
  const handleSubmit = async () => {
    setIsLoading(true)
    assert(typebot)
    setDataFlow(JSON.stringify(typebot))

    await updateDataFlow()

    setIsLoading(false)
  }

  const updateDataFlow = async () => {
    assert(typebot)
    const data = {
      name: typebot.name,
      data: dataFlow,
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('SyncDataFlowDialog.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {inputs.campaignId}
            <VStack spacing={8}>
              <FormControl isRequired>
                <FormLabel>
                  {t('SyncDataFlowDialog.webAddress.label')}
                </FormLabel>
                <Input
                  name="url"
                  value={inputs.url}
                  onChange={handleInputChange}
                  placeholder={t('SyncDataFlowDialog.webAddress.placeholder')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('SyncDataFlowDialog.password.label')}</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  placeholder={t('SyncDataFlowDialog.password.placeholder')}
                />
              </FormControl>

              {campaigns.length > 0 && (
                <FormControl isRequired>
                  <FormLabel>
                    {t('SyncDataFlowDialog.campaignId.label')}
                  </FormLabel>
                  <Select
                    name="campaignId"
                    value={inputs.campaignId}
                    onChange={handleInputChange}
                    placeholder={t('SyncDataFlowDialog.campaignId.placeholder')}
                  >
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {campaigns.length === 0 && (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleNext}
                isLoading={isLoading}
                isDisabled={!inputs.url || !inputs.password}
              >
                {t('SyncDataFlowDialog.nextButton.label')}
              </Button>
            )}
            {campaigns.length > 0 && (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={!inputs.campaignId}
              >
                {t('SyncDataFlowDialog.submitButton.label')}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
