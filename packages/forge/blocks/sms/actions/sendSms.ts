import { createAction, option } from '@typebot.io/forge'

export const sendSms = createAction({
  name: 'Send SMS',
  options: option.object({
    value: option.string.layout({
      label: 'Phone number',
      isRequired: true,
      placeholder: '+573123456789',
    }),
  }),
})
