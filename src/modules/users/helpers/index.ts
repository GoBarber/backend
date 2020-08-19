import { container } from 'tsyringe';

import IHashProvider from './HashHelper/models/IHashProvider';
import BCyprtHashProvider from './HashHelper/implementations/BCyprtHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCyprtHashProvider);
