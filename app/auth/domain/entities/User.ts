import { BaseEntity } from '@/core/domain/entities/BaseEntity';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

export interface UserWithPassword extends User {
  password: string;
}
