import { UserResponseDto } from './UserResponseDto';

export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
  refreshToken?: string;
}
