import { useState, useEffect } from 'react'
import { StoredFlowInputs, AllFlowInputs } from '../types/types'

const STORAGE_KEY_PREFIX = '@kpital.flow'

export const useLocalStorageFlow = (flowId: string) => {
  const storageKey = `${STORAGE_KEY_PREFIX}:${flowId}`

  const [inputs, setInputs] = useState<AllFlowInputs>({
    url: '',
    password: '',
    campaignId: '',
  })

  useEffect(() => {
    const storedInputs = localStorage.getItem(storageKey)
    if (storedInputs) {
      const parsedInputs: StoredFlowInputs = JSON.parse(storedInputs)
      setInputs({ ...parsedInputs, password: '' })
    }
  }, [flowId, storageKey])

  const updateInputs = (newInputs: Partial<AllFlowInputs>) => {
    const updatedInputs = { ...inputs, ...newInputs }
    setInputs(updatedInputs)

    const inputsToStore: StoredFlowInputs = {
      url: updatedInputs.url,
      campaignId: updatedInputs.campaignId,
    }
    localStorage.setItem(storageKey, JSON.stringify(inputsToStore))
  }

  return { inputs, updateInputs }
}
