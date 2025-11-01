export const IHttpClientToken = Symbol('IHttpClient');

export interface IHttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<TData, TResponse>(url: string, data: TData, config?: any): Promise<TResponse>;
  put<TData, TResponse>(url: string, data: TData, config?: any): Promise<TResponse>;
  patch<TData, TResponse>(url: string, data: TData, config?: any): Promise<TResponse>;
  delete<T>(url: string, config?: any): Promise<T>;
}
