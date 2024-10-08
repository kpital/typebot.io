import { useState, useEffect } from 'react'

const STORAGE_KEY_PREFIX = '@kpital.flow'

export function useLocalStorageFlow<T extends Record<string, string>>(
  flowId: string,
  initialValues: T
) {
  const storageKey = `${STORAGE_KEY_PREFIX}:${flowId}`

  const [values, setValues] = useState<T>(initialValues)

  useEffect(() => {
    const storedValues = localStorage.getItem(storageKey)
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues) as Partial<T>
      setValues((prevValues) => ({ ...prevValues, ...parsedValues }))
    }
  }, [flowId, storageKey])

  const updateValues = (newValues: Partial<T>) => {
    setValues((prevValues) => {
      const updatedValues = { ...prevValues, ...newValues }
      localStorage.setItem(storageKey, JSON.stringify(updatedValues))
      return updatedValues
    })
  }

  return { values, updateValues }
}
