import { UnauthorizedError } from '@/core/domain/errors/UnauthorizedError';
import { AuthToken } from '@/auth/domain/valueObjects/AuthToken';

export class TokenValidationService {
  /**
   * Validate JWT token format (basic validation)
   */
  static validateTokenFormat(token: string): boolean {
    try {
      new AuthToken(token);

      // Check if token follows JWT format (3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Validate base64 encoding of each part
      parts.forEach(part => {
        if (!this.isValidBase64(part)) {
          throw new Error('Invalid base64 encoding');
        }
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if token is expired (decode payload and check exp claim)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodePayload(token);

      if (!payload.exp) {
        return false; // No expiration claim
      }

      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true; // Invalid token is considered expired
    }
  }

  /**
   * Extract user ID from token
   */
  static extractUserId(token: string): string {
    const payload = this.decodePayload(token);

    if (!payload.userId && !payload.sub) {
      throw new UnauthorizedError('Token does not contain user ID');
    }

    return payload.userId || payload.sub;
  }

  private static decodePayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = parts[1];
      // Use atob for base64 decoding (works in React Native)
      const decoded = this.base64Decode(payload);
      return JSON.parse(decoded);
    } catch (error) {
      throw new UnauthorizedError('Failed to decode token');
    }
  }

  private static isValidBase64(str: string): boolean {
    try {
      // Add padding if needed
      const padded = str + '='.repeat((4 - str.length % 4) % 4);
      this.base64Decode(padded);
      return true;
    } catch {
      return false;
    }
  }

  private static base64Decode(str: string): string {
    // Add padding if needed for proper base64 decoding
    const padded = str + '='.repeat((4 - str.length % 4) % 4);

    // For React Native, use atob if available, otherwise manual decoding
    if (typeof atob !== 'undefined') {
      return atob(padded);
    }

    // Fallback for environments without atob
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';

    for (let i = 0; i < padded.length; i += 4) {
      const encoded = [
        chars.indexOf(padded[i]),
        chars.indexOf(padded[i + 1]),
        chars.indexOf(padded[i + 2]),
        chars.indexOf(padded[i + 3])
      ];

      const byte1 = (encoded[0] << 2) | (encoded[1] >> 4);
      const byte2 = ((encoded[1] & 15) << 4) | (encoded[2] >> 2);
      const byte3 = ((encoded[2] & 3) << 6) | encoded[3];

      result += String.fromCharCode(byte1);
      if (encoded[2] !== 64) result += String.fromCharCode(byte2);
      if (encoded[3] !== 64) result += String.fromCharCode(byte3);
    }

    return result;
  }
}
