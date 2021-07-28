import { storage } from './storage';

/**
 * CustomEvent polyfill 적용
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */

(() => {
  if (typeof window === 'undefined') {
    window = {} as unknown as Window & typeof globalThis;
  }

  if (typeof window.CustomEvent === 'function') {
    return;
  }

  function CustomEvent<T>(
    typeArg: string,
    params: CustomEventInit<T> = { bubbles: false, cancelable: false }
  ): CustomEvent<T> {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      typeArg,
      params?.bubbles ?? false,
      params?.cancelable ?? false,
      params?.detail
    );
    return evt;
  }

  window.CustomEvent = CustomEvent as unknown as typeof window.CustomEvent;
})();

export interface LocalStorageEventPayload<T> {
  key: string;
  value: T;
}

export class LocalStorageChanged<T> extends CustomEvent<LocalStorageEventPayload<T>> {
  static eventName = 'onLocalStorageChange';

  constructor(payload: LocalStorageEventPayload<T>) {
    super('onLocalStorageChange', { detail: payload });
  }
}

export function isTypeOfLocalStorageChanged<T>(event: any): event is LocalStorageChanged<T> {
  return !!event && event.type === LocalStorageChanged.eventName;
}

export function writeStorage<T>(key: string, value: T) {
  try {
    storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
    window.dispatchEvent(new LocalStorageChanged({ key, value }));
  } catch (err) {
    throw err;
  }
}

export function deleteFromStorage(key: string) {
  storage.removeItem(key);
  window.dispatchEvent(new LocalStorageChanged({ key, value: null }));
}
