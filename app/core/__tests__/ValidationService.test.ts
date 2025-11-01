import { ValidationService } from '@/core/application/services/ValidationService';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('ValidationService', () => {
  it('should validate email correctly', () => {
    expect(() => ValidationService.validateEmail('test@example.com')).not.toThrow();
    expect(() => ValidationService.validateEmail('invalid')).toThrow(ValidationError);
  });

  it('should validate required fields', () => {
    expect(() => ValidationService.validateRequired('value', 'field')).not.toThrow();
    expect(() => ValidationService.validateRequired('', 'field')).toThrow(ValidationError);
  });
});
