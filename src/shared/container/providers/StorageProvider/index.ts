import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import AzureBlobStorageProvider from './implementations/AzureBlobStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  azure: AzureBlobStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
