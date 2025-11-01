// Using bcryptjs for password hashing
import bcrypt from 'bcryptjs';

export class PasswordHashingService {
  private static readonly SALT_ROUNDS = 10;

  static async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  static async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
