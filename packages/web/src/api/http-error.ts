/* eslint-disable import/prefer-default-export */
export class HttpError extends Error {
  response: JSON | undefined;

  constructor(message: string, response?: JSON) {
    super(message);
    this.response = response;
  }
}
