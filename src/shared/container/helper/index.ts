import { container } from 'tsyringe';

import IStorageProvider from './StorageHelper/models/IStorageProvider';
import DiskStorageProvider from './StorageHelper/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
