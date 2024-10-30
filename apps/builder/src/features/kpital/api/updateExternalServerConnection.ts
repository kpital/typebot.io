import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const updateExternalServerConnection = authenticatedProcedure
  .meta({
    openapi: {
      method: 'PUT',
      path: '/v1/workspaces/{workspaceId}/external-server-connections/{connectionId}',
      protect: true,
      summary: 'Update connection to external server',
      tags: ['Kpital'],
    },
  })
  .input(
    z.object({
      workspaceId: z.string().describe('ID of the workspace'),
      connectionId: z.string().describe('ID of the connection'),
      url_backend: z.string().optional().describe('URL of the external server'),
      user: z.string().optional().describe('User for authentication'),
      password: z.string().optional().describe('Password for authentication'),
    })
  )
  .output(
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
  .mutation(async ({ input, ctx: { user } }) => {
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

    const connection = await prisma.skarletConnection.findUnique({
      where: {
        id: input.connectionId,
        workspaceId: input.workspaceId,
      },
    })

    if (!connection)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Connection not found',
      })

    return prisma.skarletConnection.update({
      where: {
        id: input.connectionId,
      },
      data: {
        ...(input.url_backend && { url_backend: input.url_backend }),
        ...(input.user && { user: input.user }),
        ...(input.password && { password: input.password }),
      },
    })
  })
