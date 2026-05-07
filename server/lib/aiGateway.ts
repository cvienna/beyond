import { createGateway } from "ai";
import { createFireworks } from "@ai-sdk/fireworks";
import { env } from "@shared/env";

export const aiGateway = createFireworks({
  apiKey: env.FIREWORKS_API_KEY,
});
