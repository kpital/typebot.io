import { createBlock } from "@typebot.io/forge";
import { createAgent } from "./actions/createAgent";
import { TransferagentDarkLogo, TransferagentLogo } from "./logo";

export const transferagentBlock = createBlock({
  id: "transferagent",
  name: "TransferAgent",
  tags: [],
  LightLogo: TransferagentLogo,
  DarkLogo: TransferagentDarkLogo,
  actions: [createAgent],
});
