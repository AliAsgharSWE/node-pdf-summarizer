export interface IDocument {
  _id?: string;
  originalFile: string;
  parsedText: string;
  summary: string;
  createdAt?: Date;
}

export interface IUploadResponse {
  parsedText: string;
  summary: string;
  id?: string;
}
