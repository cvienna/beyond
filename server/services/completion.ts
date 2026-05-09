import { generateText } from "ai";
import { aiGateway } from "@server/lib/aiGateway";

export function randomEmoji() {
  const emojies = [
    ["🖐️", "🧠", "🎀", "🎃", "🎲", "🧸"],
    ["🐤", "🐧", "🕊️", "🦢", "🦕", "🦖"],
    ["🐳", "🐬", "🐙", "🐚", "🪸", "🪼"],
    ["🌸", "🌹", "🥀", "🌺", "🌻", "🌼", "🌱", "🌵", "🦋", "🐝"],
    ["🍇", "🍊", "🍋", "🍌", "🍒", "🫐", "🥝", "🥥", "🌶️"],
    ["🌙", "🌞", "☁️", "🌀", "❄️"],
  ];

  const group = emojies[Math.floor(Math.random() * emojies.length)];
  return group[Math.floor(Math.random() * group.length)];
}

export async function generateTitle(prompt: string) {
  const response = await generateText({
    model: aiGateway("accounts/fireworks/models/gpt-oss-20b"),
    messages: [
      {
        role: "system",
        content: "Generate a short 3-4 word title for this prompt",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.text;
}
