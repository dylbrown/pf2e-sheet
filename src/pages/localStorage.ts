export function save<T>(characterName: string, value: T, ...key: string[]) {
  const data = JSON.parse(localStorage['2e-sheet:' + characterName] ?? '{}');
  let curr = data;
  for (const [i, k] of key.entries()) {
    if (i == key.length - 1) {
      curr[k] = value;
    } else {
      curr[k] = curr[k] ?? {};
      curr = curr[k];
    }
  }
  localStorage['2e-sheet:' + characterName] = JSON.stringify(data);
}

const GLOBAL = 'global';

export function saveGlobal<T>(value: T, ...key: string[]) {
  return save(GLOBAL, value, ...key);
}

export function load<T>(characterName: string, ...key: string[]): T | null {
  if (!localStorage['2e-sheet:' + characterName]) return null;
  const data = JSON.parse(localStorage['2e-sheet:' + characterName]);

  let curr = data;
  for (const [i, k] of key.entries()) {
    if (i == key.length - 1 && curr[k] != null) {
      return curr[k] as T;
    } else {
      if (curr[k] == null) return null;
      curr = curr[k];
    }
  }
  return null;
}

export function loadGlobal<T>(...key: string[]): T | null {
  return load(GLOBAL, ...key);
}

export function loadOrDefault<T>(
  characterName: string | undefined,
  defaultT: T,
  ...key: string[]
): T {
  if (!characterName || key.length == 0) return defaultT;
  const t = load<T>(characterName, ...key);
  return t ?? defaultT;
}

export function loadGlobalOrDefault<T>(
  defaultT: T,
  ...key: string[]
): T | null {
  return loadOrDefault(GLOBAL, defaultT, ...key);
}
export function reset(characterName: string) {
  localStorage.removeItem('2e-sheet:' + characterName);
}
