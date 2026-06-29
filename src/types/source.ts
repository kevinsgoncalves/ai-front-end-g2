export interface Source {
  documentId: number;
  fileName: string;
  chunkId: number;
  content: string;
  similarityScore: number;
}
