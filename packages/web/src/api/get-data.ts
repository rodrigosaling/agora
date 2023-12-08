/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/SERVER_URL';

export async function getData(url = '') {
  const response = await fetch(`${SERVER_URL}${url}`, {
    // method: 'GET',
    // headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}
