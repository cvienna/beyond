export type Pages = "home" | "chat";

export type Models = { slug: "llama-3.2-3b"; name: "Llama 3.2 3B" };

export interface Chat {
  id: string;
  title: string;
  emoji: string;

  /*
  model

  isPinned

  createdAt
  updatedAt
  deletedAt
  */
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  from: "user" | "assistant";
  createdAt: Date;

  /*
  ttft
  duration
  tokens

  sources (from search)
  */
}
