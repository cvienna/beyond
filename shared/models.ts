// only used by frontend - consider moving

import { GatewayModelId } from "ai";

const PROVIDER_ICONS: Record<string, string> = {
  default: "src/assets/ai/default.svg", // Fallback icon
  alibaba: "src/assets/ai/alibaba.svg",
  anthropic: "src/assets/ai/anthropic.svg",
  deepseek: "src/assets/ai/deepseek.svg",
  google: "src/assets/ai/gemma.svg", // diff - for preference
  meta: "src/assets/ai/meta.svg",
  minimax: "src/assets/ai/minimax.svg",
  mistral: "src/assets/ai/mistral.svg",
  moonshotai: "src/assets/ai/moonshotai.svg",
  openai: "src/assets/ai/openai.svg",
  xai: "src/assets/ai/grok.svg", // diff - for preference
  xiaomi: "src/assets/ai/xiaomi.svg",
  zai: "src/assets/ai/zai.svg",
};

export const MODELS = {
  "moonshotai/kimi-k2.6": { name: "Kimi K2.6" },
  "moonshotai/kimi-k2.5": { name: "Kimi K2.5" },

  "minimax/minimax-m2.7": { name: "MiniMax M2.7" },

  "zai/glm-5.1": { name: " GLM 5.1" },
  "zai/glm-5": { name: "GLM 5" },

  "openai/gpt-oss-20b": { name: "gpt-oss-20b" },

  "deepseek/deepseek-v4-pro": { name: "DeepSeek V4 Pro" },
  "deepseek/deepseek-v4-flash": { name: "DeepSeek V4 Flash" },

  "google/gemma-4-31b-it": { name: "Gemma 4 31B" },
  "google/gemma-4-26b-a4b-it": { name: "Gemma 4 26B A4B" },

  "xiaomi/mimo-v2.5-pro": { name: "MiMo v2.5 Pro" },
  "xiaomi/mimo-v2.5": { name: "MiMo v2.5" },
} satisfies Partial<Record<GatewayModelId, { name: string }>>;

export type ModelId = keyof typeof MODELS;

export const defaultModel: ModelId = "openai/gpt-oss-20b";

export function getModel(model: string) {
  const provider = model.split("/")[0];
  const entry = MODELS[model as keyof typeof MODELS];

  if (!entry) {
    const defaultProvider = defaultModel.split("/")[0];
    return {
      name: MODELS[defaultModel as keyof typeof MODELS].name,
      icon: PROVIDER_ICONS[defaultProvider] ?? PROVIDER_ICONS["default"],
    };
  }

  return {
    name: entry.name,
    icon: PROVIDER_ICONS[provider] ?? PROVIDER_ICONS["default"],
  };
}
