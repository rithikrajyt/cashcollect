/**
 * Typed domain errors for CashCollect.
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'DUPLICATE_REQUEST'
  | 'CONFIGURATION_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;
  readonly statusCode: number;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.statusCode = ERROR_STATUS_MAP[code];
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  CONFLICT: 409,
  DUPLICATE_REQUEST: 409,
  CONFIGURATION_ERROR: 500,
  INTERNAL_ERROR: 500,
};

/**
 * Typed result for service operations.
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function err<T>(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): Result<T> {
  return { success: false, error: new AppError(code, message, details) };
}
