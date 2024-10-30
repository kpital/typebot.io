import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const createExternalServerConnection = authenticatedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/v1/workspaces/{workspaceId}/external-server-connections',
      protect: true,
      summary: 'Create new connection to external server',
      tags: ['Kpital'],
    },
  })
  .input(
    z.object({
      workspaceId: z.string().describe('ID of the workspace'),
      url_backend: z.string().describe('URL of the external server'),
      user: z.string().describe('User for authentication'),
      password: z.string().describe('Password for authentication'),
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

    return prisma.skarletConnection.create({
      data: {
        url_backend: input.url_backend,
        user: input.user,
        password: input.password,
        workspaceId: input.workspaceId,
      },
    })
  })
