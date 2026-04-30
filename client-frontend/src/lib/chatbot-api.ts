import { api } from "@/lib/api";

export async function postChatbotQuery(message: string): Promise<string> {
  const res = await api<{ reply: string }>("/api/chatbot/query", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return res.reply;
}
