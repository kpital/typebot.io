import React from 'react'

import { useTranslate } from '@tolgee/react'
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
  VStack,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'

import { useSyncDataFlow } from '@/features/kpital/hooks/useSyncDataFlow'
export type SyncDataFlowProps = {
  isOpen: boolean
  onClose: () => void
}

export const SyncDataFlowDialog = ({ isOpen, onClose }: SyncDataFlowProps) => {
  const { t } = useTranslate()
  const {
    inputs,
    errors,
    isLoading,
    campaigns,
    handleInputChange,
    handleNext,
    handleSubmit,
  } = useSyncDataFlow(onClose)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('SyncDataFlowDialog.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
              <FormControl isRequired isInvalid={!!errors}>
                <FormLabel>
                  {t('SyncDataFlowDialog.webAddress.label')}
                </FormLabel>
                <Input
                  name="url"
                  value={inputs.url}
                  onChange={handleInputChange}
                  placeholder={t('SyncDataFlowDialog.webAddress.placeholder')}
                  isInvalid={!!errors.url}
                />
                {errors.url && (
                  <FormErrorMessage>{errors.url}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('SyncDataFlowDialog.username.label')}</FormLabel>
                <Input
                  name="username"
                  type="text"
                  value={inputs.username}
                  onChange={handleInputChange}
                  placeholder={t('SyncDataFlowDialog.username.placeholder')}
                />
                <FormErrorMessage>Hola</FormErrorMessage>
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
