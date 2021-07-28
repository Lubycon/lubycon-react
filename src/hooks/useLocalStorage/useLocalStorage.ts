import { useEffect, useState, useCallback } from 'react';
import {
  writeStorage,
  deleteFromStorage,
  LocalStorageChanged,
  isTypeOfLocalStorageChanged,
} from './localStorageEvents';
import { storage } from './storage';

function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export type LocalStorageNullableReturnValue<T> = [T | null, (newValue: any) => void, () => void];
export type LocalStorageReturnValue<T> = [T, (newValue: any) => void, () => void];

export function useLocalStorage<T = string>(key: string): LocalStorageNullableReturnValue<T>;

export function useLocalStorage<T = string>(key: string, defaulValue: T | null = null) {
  const [localState, setLocalState] = useState<T | null>(
    storage.getItem(key) === null ? defaulValue : tryParse(storage.getItem(key)!)
  );

  const onLocalStorageChange = (event: LocalStorageChanged<T> | StorageEvent) => {
    if (isTypeOfLocalStorageChanged<T>(event)) {
      if (event.detail.key === key) {
        setLocalState(event.detail.value);
      }
    } else {
      if (event.key === key) {
        setLocalState(event.newValue === null ? null : tryParse(event.newValue));
      }
    }
  };

  useEffect(() => {
    const listener = (e: Event) => onLocalStorageChange(e as LocalStorageChanged<T>);
    window.addEventListener(LocalStorageChanged.eventName, listener);

    window.addEventListener('storage', listener);

    if (storage.getItem(key) === null && defaulValue !== null) {
      writeStorage(key, defaulValue);
    }

    return () => {
      window.removeEventListener(LocalStorageChanged.eventName, listener);
      window.removeEventListener('storage', listener);
    };
  }, [key]);

  const writeState = useCallback((value: T) => writeStorage(key, value), [key]);
  const deleteState = useCallback(() => deleteFromStorage(key), [key]);
  const state: T | null = localState ?? defaulValue;

  return [state, writeState, deleteState];
}
