import { createBlock } from "@typebot.io/forge";
import { TransferagentLogo, TransferagentDarkLogo } from "./logo";
import { createAgent } from "./actions/createAgent";

export const transferagentBlock = createBlock({
  id: "transferagent",
  name: "TransferAgent",
  tags: [],
  LightLogo: TransferagentLogo,
  DarkLogo: TransferagentDarkLogo,
  actions: [createAgent],
});
