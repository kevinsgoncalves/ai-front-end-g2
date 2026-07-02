import type { Message } from '../types';
import api from './api';

export async function getBySessionId(
  sessionId: number,
): Promise<Message[]> {
  const { data } = await api.get<Message[]>(
    `/sessions/${sessionId}/messages`,
  );

  return data;
}