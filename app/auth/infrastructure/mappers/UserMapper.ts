import { User } from '@/auth/domain/entities/User';
import { UserResponseDto } from '@/auth/infrastructure/dto/UserResponseDto';

export class UserMapper {
  /**
   * Maps a UserResponseDto to a User domain entity
   */
  static toDomain(dto: UserResponseDto): User {
    return {
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isEmailVerified: dto.isEmailVerified,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Maps a User domain entity to a UserResponseDto
   */
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Maps an array of UserResponseDto to User domain entities
   */
  static toDomainArray(dtos: UserResponseDto[]): User[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Maps an array of User domain entities to UserResponseDto
   */
  static toDtoArray(users: User[]): UserResponseDto[] {
    return users.map(user => this.toDto(user));
  }
}
