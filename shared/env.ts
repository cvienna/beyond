import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing requied env var: ${key}`);
  return value;
}

export const env = {
  BASE_URL: requireEnv("VITE_BASE_URL"),
  PORT: parseInt(requireEnv("PORT")),

  AI_GATEWAY_API_KEY: requireEnv("AI_GATEWAY_API_KEY"),
  FIREWORKS_API_KEY: requireEnv("FIREWORKS_API_KEY"),
  TOGETHER_API_KEY: requireEnv("TOGETHER_API_KEY"),

  DATABASE_HOST: requireEnv("DATABASE_HOST"),
  DATABASE_PORT: parseInt(requireEnv("DATABASE_PORT")),
  DATABASE_USER: requireEnv("DATABASE_USER"),
  DATABASE_PASSWORD: requireEnv("DATABASE_PASSWORD"),
  DATABASE_NAME: requireEnv("DATABASE_NAME"),
};
