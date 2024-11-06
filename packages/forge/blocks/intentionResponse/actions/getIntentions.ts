import { createAction, option } from '@typebot.io/forge'

export const getIntentions = createAction({
  name: 'Detect Intention',
  options: option.object({
    cuestion: option.string.layout({
      label: 'Question',
      isRequired: false,
      placeholder: 'Question',
    }),
    intention_response: option
      .enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
      .layout({
        direction: 'row',
        defaultValue: '3',
      }),
  }),
})
