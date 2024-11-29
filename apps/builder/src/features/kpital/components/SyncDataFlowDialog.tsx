import React, { useEffect, useState } from 'react'

import { useTranslate } from '@tolgee/react'
import {
  Modal,
  Select,
  Button,
  FormControl,
  FormLabel,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
} from '@chakra-ui/react'

import { useSyncDataFlow } from '@/features/kpital/hooks/useSyncDataFlow'
import { useKpitalConnection } from '@/features/kpital/hooks/useExternalServerConnection'
import { useCampaigns } from '@/features/kpital/hooks/useCampaigns'
import { useAuthKpital } from '../hooks/useAuthKpital'
import { useToast } from '@/hooks/useToast'

import { SyncDataFlowForm } from './SyncDataFlowForm'

type SyncDataFlowProps = {
  isOpen: boolean
  workspaceId: string
  onClose: () => void
}

export const SyncDataFlowDialog = ({
  isOpen,
  workspaceId,
  onClose,
}: SyncDataFlowProps) => {
  const { t } = useTranslate()
  const { inputs, handleSubmit, isLoading, setInputs } =
    useSyncDataFlow(onClose)
  const { connections } = useKpitalConnection(workspaceId)
  const { fetchCampaigns, campaigns } = useCampaigns()
  const { getToken } = useAuthKpital()
  const { showToast } = useToast()

  const [updateConnection, setUpdateConnection] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (connections?.length) {
        const url = connections[0].url_backend
        const user = connections[0].user
        const password = connections[0].password
        const token = await getToken(url, user, password)

        // Si no hay token, no se puede conectar
        if (!token.token) {
          showToast({
            description:
              'Error obtaining campaigns, please verify your credentials',
            status: 'error',
          })
          return
        }

        fetchCampaigns(url, token.token)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections])

  const handleUpdateConnection = () => {
    setUpdateConnection(!updateConnection)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('SyncDataFlowDialog.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
              {!updateConnection ? (
                <FormControl isRequired>
                  <FormLabel>
                    {t('SyncDataFlowDialog.campaignId.label')}
                  </FormLabel>
                  <Select
                    name="campaignId"
                    value={inputs.campaignId}
                    placeholder={t('SyncDataFlowDialog.campaignId.placeholder')}
                    onChange={(e) => {
                      setInputs({ ...inputs, campaignId: e.target.value })
                    }}
                  >
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <div>
                  <SyncDataFlowForm
                    workspaceId={workspaceId}
                    onUpdated={handleUpdateConnection}
                  />
                </div>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleUpdateConnection}>
              {updateConnection
                ? t('SyncDataFlowDialog.cancelButton.label')
                : t('SyncDataFlowDialog.updateConfigButton.label')}
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!inputs.campaignId || updateConnection}
            >
              {t('SyncDataFlowDialog.submitButton.label')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
