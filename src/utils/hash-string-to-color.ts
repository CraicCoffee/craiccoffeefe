export function hashStringToColor(raw: string) {
  console.log('hashStringToColor', raw);
  const hash = raw.split('').reduce((acc, char) => (acc + char.charCodeAt(0)) % 360, 0);
  return `hsl(${hash}, 40%, 60%)`;
}
