import { INetworkRequestOptions, INetworkResponse } from '../types';

export const networkRequest = (options: INetworkRequestOptions) => {
  const {
    url,
    method = 'GET',
    headers,
    body,
    before = () => { },
    success = (json) => undefined,
    error = (err) => undefined,
    after = () => { }
  } = options;


  const final_headers = (() => {
    const header_options = {
      "Content-Type": "application/json",
      ...headers
    };
    return header_options;
  })();


  before();


  fetch(url, {
    method,
    headers: final_headers,
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then((json: INetworkResponse) => {
      // setTimeout(() => {
      if (json.success) {
        success(json);
        after();
      } else {
        error(json);
        after();
      }
      // }, 3000)
    })
    .catch(err => {
      error(err);
      after();
    })
};