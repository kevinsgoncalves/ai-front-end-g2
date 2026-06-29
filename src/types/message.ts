import type { Source } from './source';

export type MessageRole = 'USER' | 'ASSISTANT';

export interface Message {
  id: number;
  sessionId?: number;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: Source[];
}

export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
  sources: Source[];
}
