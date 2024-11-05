import { createAction, option } from '@typebot.io/forge'

export const getStatusUser = createAction({
  name: 'Get Status User',
  options: option.object({
    dniUser: option.string.layout({
      label: 'DNI User',
      isRequired: false,
      placeholder: 'DNI User',
    }),
    phoneUser: option.string.layout({
      label: 'Phone User',
      isRequired: false,
      placeholder: 'Phone User',
    }),
  }),
})
