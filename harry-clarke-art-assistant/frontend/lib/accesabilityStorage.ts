const STORAGE_KEY = "accessibility-settings";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

export type AccessibilitySettings = {
  textScale: number;
  letterSpacing: number;
};

type StoredData = {
  value: AccessibilitySettings;
  expiresAt: number;
};

// save setting with 1 day expiry
export function setAccessibilitySettings(value: AccessibilitySettings) {
  const data: StoredData = {
    value,
    expiresAt: Date.now() + EXPIRY_MS,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// load setting checks expiry
export function getAccessibilitySettings(): AccessibilitySettings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: StoredData = JSON.parse(raw);

    // expired  delete and ignore
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.value;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// reset setting optional use later
export function resetAccessibilitySettings() {
  localStorage.removeItem(STORAGE_KEY);
} 