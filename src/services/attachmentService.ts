import type { AttachmentDetail } from '../types';
import api from './api';

export async function getAttachmentsBySession(sessionId: number): Promise<AttachmentDetail[]> {
  const { data } = await api.get<AttachmentDetail[]>(`/sessions/${sessionId}/attachments`);
  return data;
}

export function getDownloadUrl(attachmentId: number): string {
  return `/api/attachments/${attachmentId}/download`;
}
