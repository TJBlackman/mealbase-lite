import { INetworkResponse, INetworkRequestOptions } from '../types'

export const networkRequest = (options: INetworkRequestOptions) => {
  const {
    url,
    method = 'GET',
    headers,
    body,
    before = () => { },
    success = (json) => undefined,
    error = (err) => undefined,
    after = () => { },
    latency = 0,
    host = '',
    forceSuccess = false
  } = options;

  const final_headers = (() => {
    const header_options = {
      'Content-Type': 'application/json',
      ...headers,
    };
    return header_options;
  })();

  before();

  fetch(host + url, {
    method,
    headers: final_headers,
    credentials: 'include',
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((json: any) => {
      setTimeout(() => {
        if (json.success || forceSuccess) {
          success(json);
          after();
        } else {
          error(json);
          after();
        }
      }, latency);
    })
    .catch((err) => {
      setTimeout(() => {
        if (forceSuccess) {
          success(err);
        } else {
          error(err);
        }
        after();
      }, latency)
    });
};