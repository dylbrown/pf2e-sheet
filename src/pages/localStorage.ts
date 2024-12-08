export function save<T>(characterName: string, key: string, value: T) {
  const data = JSON.parse(localStorage[characterName] ?? '{}');
  data[key] = value;
  localStorage[characterName] = JSON.stringify(data);
}

export function load<T>(characterName: string, key: string): T | null {
  if (!localStorage[characterName]) return null;
  const data = JSON.parse(localStorage[characterName]);
  if (data[key] == null) return null;
  return data[key] as T;
}
