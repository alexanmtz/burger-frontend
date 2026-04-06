import mockDb from '../../../../db.json';
import type { FetchConnector } from '../types';

export class MockFetchConnector implements FetchConnector {
  fetch<T>(path: string): Promise<T> {
    const [pathPart, queryPart] = path.split('?');
    const [collection, id] = pathPart.replace(/^\//, '').split('/');
    const data = (mockDb as Record<string, unknown>)[collection];
    if (data === undefined) throw new Error(`Mock: no data for "${collection}"`);
    if (id) {
      const item = (data as Record<string, unknown>[]).find((r) => String(r.id) === id);
      if (!item) throw new Error(`Mock: no item with id "${id}" in "${collection}"`);
      return Promise.resolve(item as T);
    }
    let results = data as Record<string, unknown>[];
    if (queryPart) {
      const params = Object.fromEntries(new URLSearchParams(queryPart));
      results = results.filter((r) => Object.entries(params).every(([k, v]) => String(r[k]) === v));
    }
    return Promise.resolve(results as T);
  }
}
