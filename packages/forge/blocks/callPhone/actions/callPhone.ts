import { createAction, option } from '@typebot.io/forge'

export const callPhone = createAction({
  name: 'Call Phone',
  options: option.object({
    value: option.string.layout({
      label: 'Phone number',
      isRequired: true,
      placeholder: '+573123456789',
    }),
  }),
})
