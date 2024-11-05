import { createAction, option } from '@typebot.io/forge'

export const recoveryUser = createAction({
  name: 'Recovery User',
  options: option.object({
    recovery_by: option.enum(['dni', 'phone', 'email']).layout({
      direction: 'row',
      defaultValue: 'dni',
    }),
    value: option.string.layout({
      label: 'Recovery value',
      isRequired: false,
      placeholder: 'Recovery value',
    }),
  }),
})
