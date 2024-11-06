import { createBlock } from '@typebot.io/forge'
import { IntentionResponseLogo } from './logo'
import { IntentionResponseDarkLogo } from './logo'
import { getIntentions } from './actions/getIntentions'

export const intentionResponseBlock = createBlock({
  id: 'intention-response',
  name: 'AI Agent',
  tags: [],
  LightLogo: IntentionResponseLogo,
  DarkLogo: IntentionResponseDarkLogo,
  actions: [getIntentions],
})
