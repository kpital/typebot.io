export interface InputsSaveFlow extends Record<string, string> {
  url: string
  campaignId: string
}

export interface CreateConnectionInput {
  id?: string
  workspaceId: string
  url_backend: string
  user: string
  password: string
}
