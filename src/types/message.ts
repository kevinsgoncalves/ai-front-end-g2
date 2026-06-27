export type MessageRole = 'USER' | 'ASSISTANT';

export interface Message {
  id: number;
  sessionId?: number;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}
