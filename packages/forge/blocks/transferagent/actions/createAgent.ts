import { createAction, option } from "@typebot.io/forge";

export const createAgent = createAction({
  name: "Transfer Agent",
  options: option.object({
    transferMessage: option.string.layout({
      label: "Mensaje de transferencia",
      isRequired: true,
      placeholder: "Ingrese el mensaje de transferencia",
    }),
    transferredMessage: option.string.layout({
      label: "Mensaje transferido",
      isRequired: true,
      placeholder: "Ingrese el mensaje transferido",
    }),
  }),
});
