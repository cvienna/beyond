import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing requied env var: ${key}`);
  return value;
}

export const env = {
  PORT: parseInt(requireEnv("PORT")),

  DATABASE_HOST: requireEnv("DATABASE_HOST"),
  DATABASE_PORT: parseInt(requireEnv("DATABASE_PORT")),
  DATABASE_USER: requireEnv("DATABASE_USER"),
  DATABASE_PASSWORD: requireEnv("DATABASE_PASSWORD"),
  DATABASE_NAME: requireEnv("DATABASE_NAME"),
};
