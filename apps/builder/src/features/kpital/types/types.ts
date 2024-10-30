export interface InputsCampaign {
  campaignId: string
}

export interface CreateConnectionInput {
  id?: string
  workspaceId: string
  url_backend: string
  user: string
  password: string
}
