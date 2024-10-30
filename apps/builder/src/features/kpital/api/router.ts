import { router } from '@/helpers/server/trpc'
import { getExternalServerConnections } from './getExternalServerConnections'
import { createExternalServerConnection } from './createExternalServerConnection'
import { updateExternalServerConnection } from './updateExternalServerConnection'
export const kpitalRouter = router({
  getExternalServerConnections,
  createExternalServerConnection,
  updateExternalServerConnection,
})

export type KpitalRouter = typeof kpitalRouter
