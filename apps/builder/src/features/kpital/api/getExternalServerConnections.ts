import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const getExternalServerConnections = authenticatedProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/v1/workspaces/{workspaceId}/external-server-connections',
      protect: true,
      summary: 'Config external server for sync flow data',
      tags: ['Kpital'],
    },
  })
  .input(
    z.object({
      workspaceId: z.string().describe('ID del workspace'),
    })
  )
  .output(
    z.array(
      z.object({
        id: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        url_backend: z.string(),
        user: z.string(),
        password: z.string(),
        workspaceId: z.string(),
      })
    )
  )
  .query(async ({ input, ctx: { user } }) => {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: input.workspaceId,
        members: { some: { userId: user.id } },
      },
    })

    if (!workspace)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found or access denied',
      })

    return prisma.skarletConnection.findMany({
      where: { workspaceId: input.workspaceId },
      orderBy: { createdAt: 'desc' },
    })
  })
