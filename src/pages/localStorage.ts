export function save<T>(characterName: string, key: string, value: T) {
  const data = JSON.parse(localStorage['2e-sheet:' + characterName] ?? '{}');
  data[key] = value;
  localStorage['2e-sheet:' + characterName] = JSON.stringify(data);
}

const GLOBAL = 'global';

export function saveGlobal<T>(key: string, value: T) {
  return save(GLOBAL, key, value);
}

export function load<T>(characterName: string, key: string): T | null {
  if (!localStorage['2e-sheet:' + characterName]) return null;
  const data = JSON.parse(localStorage['2e-sheet:' + characterName]);
  if (data[key] == null) return null;
  return data[key] as T;
}

export function loadGlobal<T>(key: string): T | null {
  return load(GLOBAL, key);
}

export function loadOrDefault<T>(
  characterName: string | undefined,
  key: string | undefined,
  defaultT: T,
): T {
  if (!characterName || !key) return defaultT;
  const t = load<T>(characterName, key);
  return t ?? defaultT;
}

export function loadGlobalOrDefault<T>(key: string, defaultT: T): T | null {
  return loadOrDefault(GLOBAL, key, defaultT);
}
