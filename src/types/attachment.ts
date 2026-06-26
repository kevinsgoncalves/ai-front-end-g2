export type AttachmentType = 'TXT' | 'PDF';

export interface Attachment {
  id: number;
  sessionId: number;
  filename: string;
  type: AttachmentType;
  size: number;
  uploadDate: string;
}
