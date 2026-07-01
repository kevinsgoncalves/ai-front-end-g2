export type AttachmentType = 'TXT' | 'PDF';
export type AttachmentStatus = 'PROCESSING' | 'INDEXED' | 'FAILED';

export interface Attachment {
  id: number;
  sessionId: number;
  filename: string;
  type: AttachmentType;
  size: number;
  status?: AttachmentStatus;
  uploadDate: string;
}
