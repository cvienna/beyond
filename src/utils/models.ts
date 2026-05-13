import { MODELS, ModelId } from "@shared/models";

export function getGroupedModels() {
  const groupedModels: Record<string, Partial<typeof MODELS>> = {};

  for (const model of Object.keys(MODELS) as ModelId[]) {
    const family = model.split("/")[0];
    if (!groupedModels[family]) {
      groupedModels[family] = {};
    }

    groupedModels[family][model] = MODELS[model];
  }

  return groupedModels;
}
