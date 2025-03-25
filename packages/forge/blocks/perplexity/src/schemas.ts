// Do not edit this file manually
import { parseBlockCredentials, parseBlockSchema } from "@typebot.io/forge";
import { auth } from "./auth";
import { perplexityBlock } from "./index";

export const perplexityBlockSchema = parseBlockSchema(perplexityBlock);
export const perplexityCredentialsSchema = parseBlockCredentials(
  perplexityBlock.id,
  auth.schema,
);
