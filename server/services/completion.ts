import OpenAI from "openai";

const ai = new OpenAI({
  baseURL: "http://localhost:8080/v1",
});

export async function* streamCompletion(
  messages: OpenAI.ChatCompletionMessageParam[],
  model: string,
) {
  const stream = await ai.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}
