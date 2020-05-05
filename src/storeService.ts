/**
 * The 'store' configuration option must conform to the API defined by localStorage with
 * the following methods:
 * 1) setItem
 * 2) getItem
 * 3) removeItem
 * 4) clear
 *
 * Beneifts:
 * 1) Allows for setting an object (not just string)
 * 2) Facade makes changing underlying store implementation easier, particular for more
 * explicit mocking in tests
 */
export class StoreService {
  cache: Storage;
  constructor(config: { store: Storage }) {
    const { store } = config;

    this.cache = store;
  }

  set(key: string, value: string | { [k: string]: any }): void {
    if (!key || !value) {
      throw TypeError("Missing arguments");
    }

    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    this.cache.setItem(key, value);
  }

  get(key: string): any {
    const value = this.cache.getItem(key);

    if (!value) {
      return null;
    } else {
      return JSON.parse(value);
    }
  }
}
