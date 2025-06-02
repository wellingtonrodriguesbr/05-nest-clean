export interface UploadParams {
  body: Buffer;
  fileName: string;
  fileType: string;
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>;
}
