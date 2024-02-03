/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';

type buildErrorObjectProps = {
  status?: number;
  title?: string;
  detail?: string;
  instance?: string;
};

export function createErrorResponse(request: Request, response: Response) {
  // REF: https://lakitna.medium.com/understanding-problem-json-adf68e5cf1f8
  response.set('Content-Type', 'application/problem+json');

  // FIXME I wish we could ditch the response use here and return just an
  // object that is then returned by the response where this function is called.
  return function buildErrorObject({
    status = 500,
    title = 'Internal Server Error',
    detail = 'Something went wrong.',
    instance = request.originalUrl,
  }: buildErrorObjectProps): Response {
    return response.status(status).json({
      timestamp: new Date().toISOString(),
      status,
      title,
      detail,
      instance,
      // unused property
      // type: 'A URL to a page with more details regarding the problem',
    });
  };
}
