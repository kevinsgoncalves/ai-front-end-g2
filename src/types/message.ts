export type Sender = 'USER' | 'ASSISTANT';

export interface Message {
  id: number;
  sessionId: number;
  sender: Sender;
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}
