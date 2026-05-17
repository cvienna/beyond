// only used by frontend - consider moving

import { GatewayModelId } from "ai";

const PROVIDER_ICONS: Record<string, string> = {
  default: "default.png", // Fallback icon
  alibaba: "alibaba.png",
  anthropic: "anthropic.png",
  deepseek: "deepseek.png",
  google: "gemma.png", // diff - for preference
  minimax: "minimax.png",
  moonshotai: "moonshotai.png",
  openai: "openai.png",
  xiaomi: "xiaomi.png",
  zai: "zai.png",
};

const providerIconsBaseUrl = {
  light: "src/assets/ai/light",
  dark: "src/assets/ai/dark",
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

function getIcon(model: string) {
  const theme = "dark";
  const baseUrl = providerIconsBaseUrl[theme];

  const provider = model.split("/")[0];
  const icon = PROVIDER_ICONS[provider] ?? PROVIDER_ICONS["default"];

  return `${baseUrl}/${icon}`;
}

export function getModel(model: string) {
  const entry = MODELS[model as keyof typeof MODELS];

  if (!entry) {
    return {
      name: MODELS[defaultModel as keyof typeof MODELS].name,
      icon: getIcon(model),
    };
  }

  return {
    name: entry.name,
    icon: getIcon(model),
  };
}
