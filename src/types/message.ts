export type MessageRole = "USER" | "ASSISTANT";

export interface Message {
  id: number;
  content: string;
  role: MessageRole;
  timestamp: string;
}