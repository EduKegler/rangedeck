export interface SettingsState {
  gridFontSize: number;
  cardSize: number;
}

export const DEFAULT_SETTINGS: SettingsState = {
  gridFontSize: 10,
  cardSize: 400,
};

export const SETTINGS_COOKIE_NAME = 'rangedeck-settings';

export function parseSettingsCookie(cookieValue: string | undefined): SettingsState {
  if (!cookieValue) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    return { 
      gridFontSize: parsed.state?.gridFontSize ?? DEFAULT_SETTINGS.gridFontSize,
      cardSize: parsed.state?.cardSize ?? DEFAULT_SETTINGS.cardSize,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
