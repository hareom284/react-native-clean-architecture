# 🔐 Clean Architecture - Todo + Authentication Example


## 📂 Complete File Structure

```
src/
 ├── core/
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── BaseEntity.ts
 │    │    ├── valueObjects/
 │    │    │    ├── Email.ts
 │    │    │    └── Password.ts
 │    │    ├── services/
 │    │    │    └── PasswordHashingService.ts
 │    │    ├── errors/
 │    │    │    ├── DomainError.ts
 │    │    │    ├── ValidationError.ts
 │    │    │    ├── UnauthorizedError.ts
 │    │    │    └── NotFoundError.ts
 │    │    └── constants/
 │    │         └── HttpStatus.ts
 │    │
 │    ├── application/
 │    │    └── services/
 │    │         └── ValidationService.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── http/
 │    │    │    ├── HttpClient.ts
 │    │    │    └── ApiErrorHandler.ts
 │    │    └── storage/
 │    │         └── AsyncStorageAdapter.ts
 │    │
 │    └── presentation/
 │         ├── theme/
 │         │    ├── colors.ts
 │         │    └── spacing.ts
 │         └── components/
 │              ├── Button.tsx
 │              └── Input.tsx
 │
 ├── auth/ (Authentication Feature)
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── User.ts
 │    │    ├── valueObjects/
 │    │    │    └── AuthToken.ts
 │    │    └── services/
 │    │         └── TokenValidationService.ts
 │    │
 │    ├── application/
 │    │    ├── ports/
 │    │    │    └── UserRepository.ts (interface)
 │    │    │
 │    │    ├── services/
 │    │    │    └── AuthValidationService.ts
 │    │    │
 │    │    └── useCases/
 │    │         ├── commands/
 │    │         │    ├── LoginCommand.ts
 │    │         │    ├── RegisterCommand.ts
 │    │         │    └── LogoutCommand.ts
 │    │         ├── queries/
 │    │         │    ├── GetCurrentUserQuery.ts
 │    │         │    └── ValidateTokenQuery.ts
 │    │         └── RootAuthUseCase.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── api/
 │    │    │    └── AuthApi.ts
 │    │    ├── dto/
 │    │    │    ├── UserDto.ts
 │    │    │    ├── LoginRequestDto.ts
 │    │    │    └── RegisterRequestDto.ts
 │    │    ├── mappers/
 │    │    │    └── UserMapper.ts
 │    │    └── repositories/
 │    │         └── UserRepositoryImpl.ts (implementation)
 │    │
 │    ├── presentation/
 │    │    ├── views/
 │    │    │    ├── LoginView.tsx
 │    │    │    └── RegisterView.tsx
 │    │    ├── components/
 │    │    │    └── AuthForm.tsx
 │    │    ├── composables/
 │    │    │    ├── commands/
 │    │    │    │    ├── useLogin.ts
 │    │    │    │    ├── useRegister.ts
 │    │    │    │    └── useLogout.ts
 │    │    │    ├── queries/
 │    │    │    │    └── useCurrentUser.ts
 │    │    │    └── useAuthActions.ts
 │    │    └── stores/
 │    │         └── authStore.ts
 │    │
 │    └── AuthModule.ts
 │
 ├── todo/ (Todo Feature)
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── Todo.ts
 │    │    ├── valueObjects/
 │    │    │    └── TodoTitle.ts
 │    │    └── services/
 │    │         └── TodoEnrichmentService.ts
 │    │
 │    ├── application/
 │    │    ├── ports/
 │    │    │    └── TodoRepository.ts (interface)
 │    │    │
 │    │    ├── services/
 │    │    │    └── TodoFilterService.ts
 │    │    │
 │    │    └── useCases/
 │    │         ├── commands/
 │    │         │    ├── CreateTodoCommand.ts
 │    │         │    ├── UpdateTodoCommand.ts
 │    │         │    ├── DeleteTodoCommand.ts
 │    │         │    └── ToggleTodoCommand.ts
 │    │         ├── queries/
 │    │         │    ├── GetTodosQuery.ts
 │    │         │    ├── GetTodoByIdQuery.ts
 │    │         │    └── GetActiveTodosQuery.ts
 │    │         └── RootTodoUseCase.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── api/
 │    │    │    └── TodoApi.ts
 │    │    ├── dto/
 │    │    │    ├── TodoDto.ts
 │    │    │    └── CreateTodoRequestDto.ts
 │    │    ├── mappers/
 │    │    │    └── TodoMapper.ts
 │    │    └── repositories/
 │    │         └── TodoRepositoryImpl.ts (implementation)
 │    │
 │    ├── presentation/
 │    │    ├── views/
 │    │    │    ├── TodoListView.tsx
 │    │    │    └── TodoDetailView.tsx
 │    │    ├── components/
 │    │    │    ├── TodoItem.tsx
 │    │    │    └── TodoForm.tsx
 │    │    ├── composables/
 │    │    │    ├── commands/
 │    │    │    │    ├── useCreateTodo.ts
 │    │    │    │    ├── useUpdateTodo.ts
 │    │    │    │    ├── useDeleteTodo.ts
 │    │    │    │    └── useToggleTodo.ts
 │    │    │    ├── queries/
 │    │    │    │    ├── useTodos.ts
 │    │    │    │    ├── useTodoById.ts
 │    │    │    │    └── useActiveTodos.ts
 │    │    │    └── useTodoActions.ts
 │    │    └── stores/
 │    │         └── todoStore.ts
 │    │
 │    └── TodoModule.ts
 │
 └── App.tsx
```

