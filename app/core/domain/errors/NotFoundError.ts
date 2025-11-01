import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(
    public readonly resourceType: string,
    public readonly resourceId: string
  ) {
    super(`${resourceType} with ID ${resourceId} not found`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
