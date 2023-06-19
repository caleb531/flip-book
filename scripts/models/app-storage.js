import * as idbKeyval from 'idb-keyval';

// This is a storage API-agnostic class for accessing local data saved by the
// app; it uses IndexedDB as the internal storage API, falling back to
// localStorage if IndexedDB is unsupported by the user's browser, or if the
// storage upgrade process could not be successfully completed
class AppStorage {
  // Only use IndexedDB if the browser supports it and if the user has opted to
  // upgrade the data store to IndexedDB
  usingIDB() {
    return Boolean(
      // The browser must support IndexedDB
      typeof indexedDB !== 'undefined' &&
        // The user does not have any app-specific data left in localStorage
        !Object.keys(localStorage).find((key) => this.appKeyPattern.test(key))
    );
  }

  // Retrieve the contents of the storage entry at the given key
  get(key) {
    if (this.usingIDB()) {
      return idbKeyval.get(key);
    } else {
      return new Promise((resolve) => {
        resolve(JSON.parse(localStorage.getItem(key)));
      });
    }
  }

  // Set the contents of the storage entry at the given key
  set(key, value) {
    if (this.usingIDB()) {
      return idbKeyval.set(key, value);
    } else {
      return new Promise((resolve) => {
        resolve(localStorage.setItem(key, JSON.stringify(value)));
      });
    }
  }

  // Remove an entry with the given key from the storage completely
  remove(key) {
    if (this.usingIDB()) {
      return idbKeyval.del(key);
    } else {
      return new Promise((resolve) => {
        resolve(localStorage.removeItem(key));
      });
    }
  }

  // Return an array of keys for all entries in the storage
  keys() {
    if (this.usingIDB()) {
      return idbKeyval.keys();
    } else {
      return new Promise((resolve) => {
        resolve(Object.keys(localStorage));
      });
    }
  }
}
// A regular expression used to identify localStorage keys specific to this
// application within a shared localStorage store
AppStorage.prototype.appKeyPattern = /^flipbook-/;

export default new AppStorage();
