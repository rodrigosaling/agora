// eslint-disable-next-line import/prefer-default-export
export function tagNamesSanitizer(tagNames: string) {
  const sanitizedNames = tagNames
    .split('\n')
    .map((line) => line.split(','))
    .flat()
    .map((name) => name.trim())
    .filter(Boolean);

  return [...new Set(sanitizedNames)];
}
