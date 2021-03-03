import { requestList } from './api';

export function listUsers(token, page, filters) {
  return requestList('/users', page, {
    token,
    args: filters,
  });
}
