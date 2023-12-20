/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/server-url';
import { LOCAL_STORAGE_TOKEN } from '../constants/local-storage';

export async function getData(url = '', headers = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    // method: 'GET',
    headers: { ...headers },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

export function getDataWithAuthorization(url = '') {
  return getData(url, {
    Authorization: localStorage.getItem(LOCAL_STORAGE_TOKEN),
  });
}
