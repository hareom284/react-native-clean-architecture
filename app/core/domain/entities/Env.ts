export interface Env {
  apiUrl: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
}

export const EnvToken = Symbol('Env');
