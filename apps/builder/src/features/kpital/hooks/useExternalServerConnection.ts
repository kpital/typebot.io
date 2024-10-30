import { trpc } from '@/lib/trpc'
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/useToast'
import { CreateConnectionInput } from '../types/types'
import { validateUrl } from '../utils/validateUrl'

export const useKpitalConnection = (workspaceId: string) => {
  const { showToast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [inputs, setInputsFields] = useState<CreateConnectionInput>({
    url_backend: '',
    user: '',
    password: '',
    workspaceId: '',
  })

  const {
    data: connections,
    isLoading,
    refetch,
  } = trpc.kpital.getExternalServerConnections.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  )
  const { mutate: createConnection } =
    trpc.kpital.createExternalServerConnection.useMutation({
      onMutate: () => {
        setIsCreating(true)
      },
      onSuccess: () => {
        showToast({
          description: 'Connection created successfully',
          status: 'success',
        })
        refetch()
      },
      onError: (error) => {
        showToast({
          description: error.message,
          status: 'error',
        })
      },
      onSettled: () => {
        setIsCreating(false)
      },
    })

  const { mutate: updateConnection } =
    trpc.kpital.updateExternalServerConnection.useMutation({
      onMutate: () => {
        setIsCreating(true)
      },
      onSuccess: () => {
        showToast({
          description: 'Connection updated successfully',
          status: 'success',
        })
        refetch()
      },
      onError: (error) => {
        showToast({
          description: error.message,
          status: 'error',
        })
      },
      onSettled: () => {
        setIsCreating(false)
      },
    })

  const createNewConnection = async (input: CreateConnectionInput) => {
    if (!workspaceId) return
    createConnection({
      ...input,
      workspaceId,
    })
  }

  const updateExistingConnection = async (
    connectionId: string,
    input: CreateConnectionInput
  ) => {
    if (!workspaceId) return
    updateConnection({
      connectionId,
      ...input,
      workspaceId,
    })
  }

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

  return {
    inputs,
    errors,
    isLoading,
    isCreating,
    connections,
    setInputsFields,
    handleInputChange,
    createNewConnection,
    updateExistingConnection,
  }
}
