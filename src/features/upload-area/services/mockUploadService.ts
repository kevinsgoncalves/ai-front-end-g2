import type { Attachment } from '../../../types/attachment';
import type { IUploadService } from './uploadService';
import { UPLOAD_PROGRESS_INTERVAL } from '../constants/upload';
import { mockAttachment } from '../mocks/uploadMock';

export class MockUploadService implements IUploadService {
  private shouldFail = false;

  constructor(options?: { shouldFail?: boolean }) {
    this.shouldFail = options?.shouldFail ?? false;
  }

  upload(
    file: File,
    sessionId: number,
    onProgress: (percent: number) => void
  ): Promise<Attachment> {
    return new Promise((resolve, reject) => {
      let progress = 0;

      const interval = setInterval(() => {
        const increment = Math.random() * 15 + 5;
        progress = Math.min(progress + increment, 100);
        onProgress(Math.round(progress));

        if (progress >= 100) {
          clearInterval(interval);

          if (this.shouldFail) {
            setTimeout(() => {
              reject({
                status: 500,
                title: 'Erro no servidor',
                detail: 'Falha simulada no upload. Tente novamente.',
              });
            }, 300);
            return;
          }

          setTimeout(() => {
            resolve({
              ...mockAttachment,
              sessionId,
              filename: file.name,
              type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT',
              size: file.size,
              uploadDate: new Date().toISOString(),
            });
          }, 500);
        }
      }, UPLOAD_PROGRESS_INTERVAL);
    });
  }
}
