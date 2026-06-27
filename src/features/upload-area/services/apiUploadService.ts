import type { Attachment } from '../../../types/attachment';
import type { IUploadService } from './uploadService';
import api from '../../../services/api';

export class ApiUploadService implements IUploadService {
  async upload(
    file: File,
    sessionId: number,
    onProgress: (percent: number) => void,
  ): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', String(sessionId));

    const { data } = await api.post<Attachment>('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percent);
        }
      },
    });

    return data;
  }
}
