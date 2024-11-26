import { createBlock } from '@typebot.io/forge'
import { CallPhoneLogo, CallPhoneDarkLogo } from './logo'
import { callPhone } from './actions/callPhone'

export const callPhoneBlock = createBlock({
  id: 'call-phone',
  name: 'Phone',
  tags: [],
  LightLogo: CallPhoneLogo,
  DarkLogo: CallPhoneDarkLogo,
  actions: [callPhone],
})
