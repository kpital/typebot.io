import { createBlock } from '@typebot.io/forge'
import { TransferagentLogo } from './logo'
import { createAgent } from './actions/CreateAgent'

export const transferagentBlock = createBlock({
  id: 'transferagent',
  name: 'TransferAgent',
  tags: [],
  LightLogo: TransferagentLogo,
  actions: [createAgent],
})
