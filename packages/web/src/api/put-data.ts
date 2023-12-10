/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/SERVER_URL';
import { LOCAL_STORAGE_PERSON_HASH } from '../constants/local-storage';

export async function putData(url = '', data = {}, headers = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

export function putDataWithAuthorization(url = '', data = {}) {
  return putData(url, data, {
    authorization: localStorage.getItem(LOCAL_STORAGE_PERSON_HASH),
  });
}
