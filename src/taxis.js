import { requestList } from './api';

export function listTaxis(token, page, filters) {
  return requestList('/taxis/all', page, {
    token,
    args: filters,
  });
}
