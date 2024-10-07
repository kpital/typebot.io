import { createBlock } from '@typebot.io/forge'
import { TransferagentLightLogo, TransferagentDarkLogo } from './logo'
import { createAgent } from './actions/createAgent'

export const transferagentBlock = createBlock({
  id: 'transferagent',
  name: 'TransferAgent',
  tags: [],
  LightLogo: TransferagentLightLogo,
  DarkLogo: TransferagentDarkLogo,
  actions: [createAgent],
})
