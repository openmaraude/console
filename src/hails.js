import { request } from './api';

export async function listHails(token, page, filters) {
  const url = '/hails';
  const args = {};

  if (page) {
    args.p = page + 1;
  }
  if (filters?.id) {
    args.id = filters.id;
  }
  if (filters?.taxi_id) {
    args.taxi_id = filters.taxi_id;
  }

  const resp = await request(url, {
    token,
    args,
  });
  return { data: resp.data, meta: resp.meta };
}
