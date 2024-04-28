export function sanitizeColumnName(
  columnName: string | undefined,
  defaultKey: string,
  allowedValues: Record<string, string>,
): string {
  const sanitizedColumnName = columnName?.trim().toLowerCase();

  if (!sanitizedColumnName || !allowedValues[sanitizedColumnName]) {
    return allowedValues[defaultKey];
  }

  return allowedValues[sanitizedColumnName];
}
