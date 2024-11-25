import { createBlock } from '@typebot.io/forge'
import { SmsLogo, SmsLogoDarkLogo } from './logo'
import { sendSms } from './actions/sendSms'

export const smsBlock = createBlock({
  id: 'sms',
  name: 'Sms',
  tags: [],
  LightLogo: SmsLogo,
  DarkLogo: SmsLogoDarkLogo,
  actions: [sendSms],
})
