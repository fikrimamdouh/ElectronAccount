// Custom error hierarchy for structured error handling

export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 404, code);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 409, code);
    this.name = "ConflictError";
  }
}

export class InvalidStateError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
    this.name = "InvalidStateError";
  }
}
