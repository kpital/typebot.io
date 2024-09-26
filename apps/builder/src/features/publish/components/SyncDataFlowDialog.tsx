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
    const respuesta = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    if (!respuesta.ok) {
      throw new Error('Error al obtener el token')
    }

    const datos = await respuesta.json()
    return datos.token
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
    assert(typebot)
    const dataFlow = JSON.stringify(typebot)

    const token = await getToken(
      session?.user?.email ?? '',
      inputs.password,
      inputs.url
    )
    if (token) {
      // Aquí puedes manejar la lógica para enviar dataFlow con el token
      console.log('Token obtenido:', token)
      console.log('Flujo de datos:', dataFlow)
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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {t('SyncDataFlowDialog.submitButton.label')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
