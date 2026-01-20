'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { DEFAULT_SETTINGS, SETTINGS_COOKIE_NAME, type SettingsState } from '../lib/settings';

export { DEFAULT_SETTINGS, SETTINGS_COOKIE_NAME, type SettingsState } from '../lib/settings';

const cookieStorage: StateStorage = {
  getItem: (name) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax`;
  },
  removeItem: (name) => {
    document.cookie = `${name}=;path=/;max-age=0`;
  },
};

interface SettingsActions {
  setGridFontSize: (size: number) => void;
  setCardSize: (size: number) => void;
  reset: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      setGridFontSize: (size) => set({ gridFontSize: size === 0 ? 0 : Math.max(10, Math.min(16, size)) }),
      
      setCardSize: (size) => set({ cardSize: size }),
      
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: SETTINGS_COOKIE_NAME,
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
