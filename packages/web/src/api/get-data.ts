import { SERVER_URL } from '../constants/server-url';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants/local-storage';
import { HttpError } from './http-error';

export type searchParamsProps =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams
  | undefined;

export type getDataProps = {
  url?: string;
  headers?: HeadersInit | undefined;
  searchParams?: searchParamsProps;
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
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  return getData({
    ...props,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
