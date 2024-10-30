import { useEffect } from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Text,
  Button,
  Skeleton,
} from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { useKpitalConnection } from '../hooks/useExternalServerConnection'

export const SyncDataFlowForm = () => {
  const { t } = useTranslate()

  const {
    inputs,
    errors,
    isLoading,
    connections,
    setInputsFields,
    handleInputChange,
    createNewConnection,
    updateExistingConnection,
  } = useKpitalConnection('cm2t3osv60001uksao896spoq')

  useEffect(() => {
    if (connections?.length) {
      setInputsFields({
        url_backend: connections[0].url_backend,
        user: connections[0].user,
        password: connections[0].password,
        workspaceId: 'cm2t3osv60001uksao896spoq',
      })
    }
  }, [connections, setInputsFields])

  const handleSaveUpdateConnection = async () => {
    if (isEditing) {
      await updateExistingConnection(connections[0].id, {
        workspaceId: 'cm2t3osv60001uksao896spoq',
        url_backend: inputs.url_backend,
        user: inputs.user,
        password: inputs.password,
      })
    } else {
      await createNewConnection({
        workspaceId: 'cm2t3osv60001uksao896spoq',
        url_backend: inputs.url_backend,
        user: inputs.user,
        password: inputs.password,
      })
    }
  }

  const isEditing = !!connections?.length

  return (
    <>
      {isLoading ? (
        <Skeleton height="100%" />
      ) : (
        <Box
          p="4"
          borderWidth="1px"
          borderColor="border.disabled"
          color="fg.disabled"
        >
          <VStack spacing={8}>
            <VStack spacing={2}>
              <Heading size="md">
                {t('SyncDataFlowDialog.backendSettings')}
              </Heading>
              <Text textStyle="xs" padding={0} margin={0}>
                {t('SyncDataFlowDialog.backendSettingsDescription')}
              </Text>
            </VStack>
            <FormControl isRequired isInvalid={!!errors}>
              <FormLabel>{t('SyncDataFlowDialog.webAddress.label')}</FormLabel>
              <Input
                name="url_backend"
                value={inputs.url_backend}
                onChange={handleInputChange}
                placeholder={t('SyncDataFlowDialog.webAddress.placeholder')}
                isInvalid={!!errors.url_backend}
              />
              {errors.url && <FormErrorMessage>{errors.url}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('SyncDataFlowDialog.username.label')}</FormLabel>
              <Input
                name="username"
                type="text"
                value={inputs.user}
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
          </VStack>
          <VStack spacing={2} align="flex-end">
            <Button
              mt={4}
              colorScheme="blue"
              type="submit"
              onClick={handleSaveUpdateConnection}
            >
              {isEditing
                ? t('SyncDataFlowDialog.updateButton.label')
                : t('SyncDataFlowDialog.saveButton.label')}
            </Button>
          </VStack>
        </Box>
      )}
    </>
  )
}
