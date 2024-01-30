/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/server-url';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants/local-storage';

export class HttpError extends Error {
  response: JSON | undefined;

  constructor(message: string, response?: JSON) {
    super(message);
    this.response = response;
  }
}

export async function postData(url = '', data = {}, headers = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });

  const responseAsJSON = await response.json();

  if (!response.ok) {
    throw new HttpError(responseAsJSON.title, responseAsJSON);
  }

  return responseAsJSON;
}

export function postDataWithAuthorization(url = '', data = {}) {
  return postData(url, data, {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
  });
}
