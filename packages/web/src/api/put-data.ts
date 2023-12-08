/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/SERVER_URL';

export async function putData(url = '', data = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}
