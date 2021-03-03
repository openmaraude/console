import { requestList } from './api';

export function listHails(token, page, filters) {
  return requestList('/hails', page, {
    token,
    args: filters,
  });
}
