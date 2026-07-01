import type { Attachment } from '../types';
import api from './api';

export async function getAttachmentsBySessionId(
  sessionId: number,
): Promise<Attachment[]> {
  const { data } = await api.get<Attachment[]>(
    `/sessions/${sessionId}/attachments`,
  );
  return data;
}

export function getDownloadUrl(attachmentId: number): string {
  return `/api/attachments/${attachmentId}/download`;
}
