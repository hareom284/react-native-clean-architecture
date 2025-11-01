import { getModuleContainer, module } from 'inversiland';
import { IHttpClientToken } from '@/core/domain/specifications/IHttpClient';
import { IStorageToken } from '@/core/domain/specifications/IStorage';
import { HttpClient } from '@/core/infrastructure/http/HttpClient';
import { AsyncStorageAdapter } from '@/core/infrastructure/storage/AsyncStorageAdapter';
import { Env, EnvToken } from '@/core/domain/entities/Env';

// Environment configuration
const env: Env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  environment: (process.env.NODE_ENV as any) || 'development',
};

@module({
  providers: [
    // Environment
    {
      provide: EnvToken,
      useValue: env,
      isGlobal: true,
    },

    // HTTP Client
    {
      provide: IHttpClientToken,
      useClass: HttpClient,
      isGlobal: true,
    },

    // Storage
    {
      provide: IStorageToken,
      useClass: AsyncStorageAdapter,
      isGlobal: true,
    },
  ],
})
export class CoreModule {}

export const coreModuleContainer = getModuleContainer(CoreModule);
