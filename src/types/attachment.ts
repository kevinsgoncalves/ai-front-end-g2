export type AttachmentType = 'TXT' | 'PDF';
export type AttachmentStatus = 'PROCESSING' | 'INDEXED' | 'FAILED';

export type DocumentStatus =
  | 'RECEIVED'
  | 'PROCESSING'
  | 'INDEXED'
  | 'FAILED';

export interface Attachment {
  id: number;
  sessionId: number;
  filename: string;
  type: AttachmentType;
  size: number;
  status?: AttachmentStatus;
  uploadDate: string;
}

export interface AttachmentDetail extends Attachment {
  documentId: number;
  documentStatus: DocumentStatus;
  errorMessage: string | null;
}