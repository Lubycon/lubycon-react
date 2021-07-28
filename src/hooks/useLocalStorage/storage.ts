/**
 * https://github.com/Lubycon/lubycon-utils/blob/main/src/localStorage/index.ts#L11
 */
export function canUseStorage() {
  if (typeof window !== 'object') {
    return false;
  }
  let storage;
  try {
    storage = window.localStorage;
    const testItem = '__storage_test__';
    storage.setItem(testItem, testItem);
    storage.removeItem(testItem);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      storage &&
      storage.length !== 0
    );
  }
}

interface IStorage {
  getItem(key: string): string | null;
  setItem(Key: string, value: string): void;
  removeItem(key: string): void;
}

export class LocalStorage implements IStorage {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

const storageFrom = (isAvailable: boolean) => {
  if (isAvailable) {
    return new LocalStorage();
  }
  return;
};

export const storage = storageFrom(!!canUseStorage());
