import { z } from 'zod'

export const KpitalSyncFlowSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  campaignId: z.string().uuid(),
  baseUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type KpitalSyncFlow = z.infer<typeof KpitalSyncFlowSchema>
