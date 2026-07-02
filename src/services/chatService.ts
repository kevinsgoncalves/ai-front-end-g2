import type { ChatResponse } from '../types';
import api from './api';

export async function sendMessage(
  sessionId: number,
  content: string,
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>(
    '/chat',
    {
      sessionId,
      content,
    },
    {
      timeout: 180000,
    },
  );

  return data;
}