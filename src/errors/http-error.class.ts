export class HttpError extends Error {
  constructor(public code: number, message: string, public context?: string) {
    super(message);
  }
}
