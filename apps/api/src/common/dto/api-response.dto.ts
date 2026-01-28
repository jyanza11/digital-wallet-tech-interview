export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }

  static success<T>(data: T, message = 'Operación exitosa'): ApiResponse<T> {
    return new ApiResponse({
      success: true,
      message,
      data,
    });
  }

  static error(message: string, error?: string): ApiResponse {
    return new ApiResponse({
      success: false,
      message,
      error,
    });
  }
}
