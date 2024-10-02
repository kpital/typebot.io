export interface StoredFlowInputs {
  url: string
  campaignId: string
}

export interface AllFlowInputs extends StoredFlowInputs {
  password: string
}
