/* eslint-disable import/prefer-default-export */
import { SERVER_URL } from '../constants/server-url';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants/local-storage';
import { HttpError } from './http-error';

type getDataProps = {
  url: string;
  headers?: HeadersInit | undefined;
  searchParams?:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined;
};
export async function getData({ url, headers, searchParams }: getDataProps) {
  const fetchUrl = new URL(`${SERVER_URL}${url}`);
  fetchUrl.search = new URLSearchParams(searchParams).toString();

  const response = await fetch(fetchUrl, {
    headers,
  });

  const responseAsJSON = await response.json();

  if (!response.ok) {
    throw new HttpError(responseAsJSON.title, responseAsJSON);
  }
  return responseAsJSON;
}

export function getDataWithAuthorization({
  headers = {},
  ...props
}: getDataProps) {
  return getData({
    ...props,
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN
      )}`,
    },
  });
}
