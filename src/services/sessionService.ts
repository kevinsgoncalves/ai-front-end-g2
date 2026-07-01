import type { Session } from '../types';
import api from './api';

export async function getSessions(): Promise<Session[]> {
  const { data } = await api.get<Session[]>('/sessions');
  return data;
}

export async function getSessionById(id: number): Promise<Session> {
  const { data } = await api.get<Session>(`/sessions/${id}`);
  return data;
}

export async function createSession(title: string): Promise<Session> {
  const { data } = await api.post<Session>('/sessions', { title });
  return data;
}

export async function deleteSession(id: number): Promise<void> {
  await api.delete(`/sessions/${id}`);
}

export async function updateSessionTitle(
  id: number,
  title: string,
): Promise<Session> {
  const { data } = await api.patch<Session>(`/sessions/${id}/title`, {
    title,
  });
  return data;
}

