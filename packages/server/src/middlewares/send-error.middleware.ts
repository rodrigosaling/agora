import express from 'express';
import { createErrorResponse } from '../utils/build-error-response';

export const router = express.Router();

router.use(async (request, response, next) => {
  const sendError = createErrorResponse(request, response);
  response.locals.sendError = sendError;

  return next();
});
