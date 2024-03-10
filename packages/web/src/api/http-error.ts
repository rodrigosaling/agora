export class HttpError extends Error {
  response: JSON | undefined;

  constructor(message: string, response?: JSON) {
    super(message);
    this.response = response;
  }
}
