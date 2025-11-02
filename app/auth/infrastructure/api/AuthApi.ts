import { inject, injectable } from 'inversiland';
import { IHttpClient, IHttpClientToken } from '@/core/domain/specifications/IHttpClient';
import { LoginRequestDto } from '@/auth/infrastructure/dto/LoginRequestDto';
import { RegisterRequestDto } from '@/auth/infrastructure/dto/RegisterRequestDto';
import { AuthResponseDto } from '@/auth/infrastructure/dto/AuthResponseDto';
import { UserResponseDto } from '@/auth/infrastructure/dto/UserResponseDto';

@injectable()
export class AuthApi {
  private readonly basePath = '/auth';

  constructor(@inject(IHttpClientToken) private httpClient: IHttpClient) {}

  /**
   * Login with email and password
   */
  async login(request: LoginRequestDto): Promise<AuthResponseDto> {
    return this.httpClient.post<LoginRequestDto, AuthResponseDto>(`${this.basePath}/login`, request);
  }

  /**
   * Register a new user
   */
  async register(request: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.httpClient.post<RegisterRequestDto, AuthResponseDto>(`${this.basePath}/register`, request);
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    return this.httpClient.post<{}, void>(`${this.basePath}/logout`, {});
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<UserResponseDto> {
    return this.httpClient.get<UserResponseDto>(`${this.basePath}/me`);
  }

  /**
   * Validate a token
   */
  async validateToken(token: string): Promise<{ valid: boolean }> {
    return this.httpClient.post<{ token: string }, { valid: boolean }>(`${this.basePath}/validate-token`, { token });
  }

  /**
   * Refresh an access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    return this.httpClient.post<{ refreshToken: string }, AuthResponseDto>(`${this.basePath}/refresh`, { refreshToken });
  }
}
