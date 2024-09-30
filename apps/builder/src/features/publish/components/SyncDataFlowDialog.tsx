import React, { useState } from 'react'
import assert from 'assert'
import { useTranslate } from '@tolgee/react'
import { useSession } from 'next-auth/react'

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
  FormHelperText,
} from '@chakra-ui/react'

import { useTypebot } from '@/features/editor/providers/TypebotProvider'

export type SyncDataFlowProps = {
  isOpen: boolean
  onClose: () => void
}

type TokenResponse = {
  access: string
  refresh: string
}

/**
 * Esta función es responsable de obtener un token de autenticación utilizando
 * las credenciales del usuario y la URL proporcionada. Envía una solicitud POST con
 * el nombre de usuario y la contraseña en el cuerpo de la solicitud. Si la solicitud es exitosa,
 * devuelve el token de la respuesta. Si hay un error, registra el error y devuelve null.
 *
 * @param {string} username - El nombre de usuario para la autenticación.
 * @param {string} password - La contraseña para la autenticación.
 * @param {string} url - La URL a la que enviar la solicitud de autenticación.
 * @returns {Promise<string | null>} - Una promesa que se resuelve en el token si tiene éxito, o null si hay un error.
 */
const getToken = async (
  username: string,
  password: string,
  url: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al obtener el token')
    }

    const data: TokenResponse = await response.json()
    return data.access
  } catch (error) {
    console.error('Error al obtener el token:', error)
    return null
  }
}

export const SyncDataFlowDialog = ({ isOpen, onClose }: SyncDataFlowProps) => {
  const { t } = useTranslate()
  const { typebot } = useTypebot()
  const { data: session } = useSession()

  // Estado del formulario
  const [inputs, setInputs] = useState({
    url: '',
    campaignId: '',
    password: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [dataFlow, setDataFlow] = useState<string | null>(null)

  // Manejador de cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }

  /**
   * Esta función es responsable de obtener un token de autenticación utilizando
   * las credenciales del usuario y la URL proporcionada. Luego, convierte el objeto `typebot`
   * a una cadena JSON y, si se obtiene un token válido, realiza la lógica necesaria
   * para enviar los datos del flujo junto con el token.
   */
  const handleSubmit = async () => {
    setIsLoading(true)
    assert(typebot)
    setDataFlow(JSON.stringify(typebot))

    const token = await getToken(
      session?.user?.email ?? '',
      inputs.password,
      inputs.url
    )
    if (token) {
      setToken(token)
      await updateDataFlow()
    }
    setIsLoading(false)
  }

  const updateDataFlow = async () => {
    const response = await fetch(`${inputs.url}/api/typebots/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: dataFlow,
    })
    if (response.ok) {
      console.log('DataFlow updated successfully')
    } else {
      console.error('Failed to update DataFlow')
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
            <FormControl>
              <FormLabel>{t('SyncDataFlowDialog.webAddress.label')}</FormLabel>
              <Input
                name="url"
                value={inputs.url}
                onChange={handleInputChange}
                placeholder={t('SyncDataFlowDialog.webAddress.placeholder')}
              />
              <FormHelperText></FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>{t('SyncDataFlowDialog.campaignId.label')}</FormLabel>
              <Input
                name="campaignId"
                value={inputs.campaignId}
                onChange={handleInputChange}
                placeholder={t('SyncDataFlowDialog.campaignId.placeholder')}
              />
              <FormHelperText></FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>{t('SyncDataFlowDialog.password.label')}</FormLabel>
              <Input
                name="password"
                type="password"
                value={inputs.password}
                onChange={handleInputChange}
                placeholder={t('SyncDataFlowDialog.password.placeholder')}
              />
              <FormHelperText></FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {t('SyncDataFlowDialog.submitButton.label')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
