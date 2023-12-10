/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/SERVER_URL';
import { LOCAL_STORAGE_PERSON_HASH } from '../constants/local-storage';

export async function postData(url = '', data = {}, headers = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

export function postDataWithAuthorization(url = '', data = {}) {
  return postData(url, data, {
    authorization: localStorage.getItem(LOCAL_STORAGE_PERSON_HASH),
  });
}
