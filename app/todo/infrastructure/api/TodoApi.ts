import { injectable, inject } from 'inversiland';
import { IHttpClient, IHttpClientToken } from '@/core/domain/specifications/IHttpClient';
import { TodoResponseDto } from '@/todo/infrastructure/dto/TodoResponseDto';
import { CreateTodoRequestDto } from '@/todo/infrastructure/dto/CreateTodoRequestDto';
import { UpdateTodoRequestDto } from '@/todo/infrastructure/dto/UpdateTodoRequestDto';

/**
 * Todo API - Handles HTTP requests to todo endpoints
 */
@injectable()
export class TodoApi {
  constructor(
    @inject(IHttpClientToken) private httpClient: IHttpClient
  ) {}

  /**
   * Get all todos
   */
  async getAll(): Promise<TodoResponseDto[]> {
    return this.httpClient.get<TodoResponseDto[]>('/todos');
  }

  /**
   * Get single todo by ID
   */
  async getById(id: string): Promise<TodoResponseDto> {
    return this.httpClient.get<TodoResponseDto>(`/todos/${id}`);
  }

  /**
   * Create new todo
   */
  async create(payload: CreateTodoRequestDto): Promise<TodoResponseDto> {
    return this.httpClient.post<CreateTodoRequestDto, TodoResponseDto>(
      '/todos',
      payload
    );
  }

  /**
   * Update existing todo
   */
  async update(id: string, payload: UpdateTodoRequestDto): Promise<TodoResponseDto> {
    return this.httpClient.put<UpdateTodoRequestDto, TodoResponseDto>(
      `/todos/${id}`,
      payload
    );
  }

  /**
   * Delete todo
   */
  async delete(id: string): Promise<void> {
    await this.httpClient.delete(`/todos/${id}`);
  }

  /**
   * Toggle todo completion
   */
  async toggle(id: string): Promise<TodoResponseDto> {
    return this.httpClient.patch<{}, TodoResponseDto>(
      `/todos/${id}/toggle`,
      {}
    );
  }

  /**
   * Get completed todos
   */
  async getCompleted(): Promise<TodoResponseDto[]> {
    return this.httpClient.get<TodoResponseDto[]>('/todos?status=completed');
  }

  /**
   * Get pending todos
   */
  async getPending(): Promise<TodoResponseDto[]> {
    return this.httpClient.get<TodoResponseDto[]>('/todos?status=pending');
  }
}
