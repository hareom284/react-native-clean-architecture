import { UserMapper } from '@/auth/infrastructure/mappers/UserMapper';
import { User } from '@/auth/domain/entities/User';
import { UserResponseDto } from '@/auth/infrastructure/dto/UserResponseDto';

describe('UserMapper', () => {
  const mockUserDto: UserResponseDto = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  };

  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  describe('toDomain', () => {
    it('should map UserResponseDto to User domain entity', () => {
      const result = UserMapper.toDomain(mockUserDto);

      expect(result.id).toBe(mockUserDto.id);
      expect(result.email).toBe(mockUserDto.email);
      expect(result.firstName).toBe(mockUserDto.firstName);
      expect(result.lastName).toBe(mockUserDto.lastName);
      expect(result.isEmailVerified).toBe(mockUserDto.isEmailVerified);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe(mockUserDto.createdAt);
      expect(result.updatedAt.toISOString()).toBe(mockUserDto.updatedAt);
    });

    it('should correctly parse ISO date strings to Date objects', () => {
      const result = UserMapper.toDomain(mockUserDto);

      expect(result.createdAt.getTime()).toBe(new Date('2024-01-01T00:00:00.000Z').getTime());
      expect(result.updatedAt.getTime()).toBe(new Date('2024-01-02T00:00:00.000Z').getTime());
    });

    it('should handle different date formats', () => {
      const dto = {
        ...mockUserDto,
        createdAt: '2024-06-15T14:30:00.000Z',
        updatedAt: '2024-06-16T10:00:00.000Z',
      };

      const result = UserMapper.toDomain(dto);

      expect(result.createdAt.toISOString()).toBe('2024-06-15T14:30:00.000Z');
      expect(result.updatedAt.toISOString()).toBe('2024-06-16T10:00:00.000Z');
    });
  });

  describe('toDto', () => {
    it('should map User domain entity to UserResponseDto', () => {
      const result = UserMapper.toDto(mockUser);

      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.firstName).toBe(mockUser.firstName);
      expect(result.lastName).toBe(mockUser.lastName);
      expect(result.isEmailVerified).toBe(mockUser.isEmailVerified);
      expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should correctly convert Date objects to ISO strings', () => {
      const result = UserMapper.toDto(mockUser);

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('toDomainArray', () => {
    it('should map array of UserResponseDto to array of User entities', () => {
      const dtos: UserResponseDto[] = [
        mockUserDto,
        { ...mockUserDto, id: '456', email: 'jane@example.com', firstName: 'Jane' },
      ];

      const result = UserMapper.toDomainArray(dtos);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('123');
      expect(result[1].id).toBe('456');
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[1].createdAt).toBeInstanceOf(Date);
    });

    it('should return empty array when given empty array', () => {
      const result = UserMapper.toDomainArray([]);
      expect(result).toEqual([]);
    });

    it('should handle large arrays', () => {
      const dtos = Array.from({ length: 100 }, (_, i) => ({
        ...mockUserDto,
        id: `user-${i}`,
        email: `user${i}@example.com`,
      }));

      const result = UserMapper.toDomainArray(dtos);

      expect(result).toHaveLength(100);
      expect(result[0].id).toBe('user-0');
      expect(result[99].id).toBe('user-99');
    });
  });

  describe('toDtoArray', () => {
    it('should map array of User entities to array of UserResponseDto', () => {
      const users: User[] = [
        mockUser,
        { ...mockUser, id: '456', email: 'jane@example.com', firstName: 'Jane' },
      ];

      const result = UserMapper.toDtoArray(users);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('123');
      expect(result[1].id).toBe('456');
      expect(typeof result[0].createdAt).toBe('string');
      expect(typeof result[1].createdAt).toBe('string');
    });

    it('should return empty array when given empty array', () => {
      const result = UserMapper.toDtoArray([]);
      expect(result).toEqual([]);
    });
  });

  describe('round-trip mapping', () => {
    it('should preserve data when mapping DTO -> Domain -> DTO', () => {
      const domain = UserMapper.toDomain(mockUserDto);
      const dto = UserMapper.toDto(domain);

      expect(dto).toEqual(mockUserDto);
    });

    it('should preserve data when mapping Domain -> DTO -> Domain', () => {
      const dto = UserMapper.toDto(mockUser);
      const domain = UserMapper.toDomain(dto);

      expect(domain.id).toBe(mockUser.id);
      expect(domain.email).toBe(mockUser.email);
      expect(domain.firstName).toBe(mockUser.firstName);
      expect(domain.lastName).toBe(mockUser.lastName);
      expect(domain.isEmailVerified).toBe(mockUser.isEmailVerified);
      expect(domain.createdAt.getTime()).toBe(mockUser.createdAt.getTime());
      expect(domain.updatedAt.getTime()).toBe(mockUser.updatedAt.getTime());
    });
  });
});
