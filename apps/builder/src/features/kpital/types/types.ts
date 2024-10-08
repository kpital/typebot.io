export interface StoredFlowInputs {
  url: string
  campaignId: string
}

export interface AllFlowInputs extends StoredFlowInputs {
  password: string
}

export interface LoginInputs {
  username: string
  password: string
}

export interface InputsSaveFlow extends Record<string, string> {
  url: string
  campaignId: string
}
