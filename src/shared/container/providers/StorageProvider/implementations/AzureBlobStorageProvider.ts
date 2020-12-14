import {
  StorageSharedKeyCredential,
  BlobServiceClient,
} from '@azure/storage-blob';
import path from 'path';
import uploadConfig from '@config/upload';
import mime from 'mime';
import fs from 'fs';
import IStorageProvider from '../models/IStorageProvider';

class AzureBlobStorageProvider implements IStorageProvider {
  private blobService: BlobServiceClient;

  constructor() {
    this.blobService = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT_NAME as string,
        process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY as string,
      ),
    );
  }

  async saveFile(filename: string): Promise<string> {
    const containerClient = await this.blobService.getContainerClient(
      'photoblobs',
    );

    const filePath = path.resolve(uploadConfig.tmpFolder, filename);
    const fileType = mime.getType(filePath) || undefined;

    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    await blockBlobClient.uploadFile(filePath, {
      blobHTTPHeaders: { blobContentType: fileType },
    });

    await fs.promises.unlink(filePath);

    return filename;
  }

  async deleteFile(file: string): Promise<void> {
    const containerClient = await this.blobService.getContainerClient(
      'photoblobs',
    );

    const blockBlobClient = containerClient.getBlockBlobClient(file);

    await blockBlobClient.deleteIfExists();
  }
}

export default AzureBlobStorageProvider;
