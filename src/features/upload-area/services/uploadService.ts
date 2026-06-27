import type { Attachment } from '../../../types/attachment';

export interface IUploadService {
  upload(
    file: File,
    sessionId: number,
    onProgress: (percent: number) => void
  ): Promise<Attachment>;
}
