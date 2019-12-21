import httpStatus from 'http-status';

interface ErrorOptions {
  message: string;
  errors?: string | string[];
  status?: number;
  isPublic?: boolean;
  stack?: string;
}
/**
 * @extends Error
 */
class ExtendableError extends Error {
  errors: string | string[];
  status: number;
  isPublic: boolean;
  isOperational: boolean;

  constructor(errorOptions: ErrorOptions) {
    const { message, errors, status, isPublic, stack } = errorOptions;
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
    // Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }: ErrorOptions) {
    super({
      message,
      errors,
      status,
      isPublic,
      stack,
    });
  }
}

export default APIError;
