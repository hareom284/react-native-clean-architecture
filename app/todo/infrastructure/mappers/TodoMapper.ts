import { Todo } from '@/todo/domain/entities/Todo';
import { TodoResponseDto } from '@/todo/infrastructure/dto/TodoResponseDto';

/**
 * Mapper to transform between Todo entity and DTOs
 */
export class TodoMapper {
  /**
   * Transform DTO from API to Domain Entity
   */
  static toDomain(dto: TodoResponseDto): Todo {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      isCompleted: dto.isCompleted,
      userId: dto.userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Transform Domain Entity to DTO
   */
  static toDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
      userId: todo.userId,
      dueDate: todo.dueDate?.toISOString(),
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }

  /**
   * Transform array of DTOs to array of Domain Entities
   */
  static toDomainList(dtos: TodoResponseDto[]): Todo[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  /**
   * Transform array of Domain Entities to array of DTOs
   */
  static toDtoList(todos: Todo[]): TodoResponseDto[] {
    return todos.map(todo => this.toDto(todo));
  }
}
