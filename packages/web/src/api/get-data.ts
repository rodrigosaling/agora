/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/server-url';
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_PERSON_EMAIL,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants/local-storage';
import { HttpError } from './post-data';

export async function getData(url = '', headers = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    // method: 'GET',
    headers: { ...headers },
  });

  const responseAsJSON = await response.json();

  if (!response.ok) {
    // if (responseAsJSON.detail === 'Access token expired.') {
    //   const refreshResponse = await fetch(`${SERVER_URL}/login/refresh-token`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN),
    //       email: localStorage.getItem(LOCAL_STORAGE_PERSON_EMAIL),
    //     }),
    //   });

    //   const { accessToken, refreshToken } = await refreshResponse.json();
    //   localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
    //   localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
    // }
    throw new HttpError(responseAsJSON.title, responseAsJSON);
  }
  return responseAsJSON;
}

export function getDataWithAuthorization(url = '') {
  return getData(url, {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
  });
}
