// Compares dotted versions part by part: negative if a < b, 0 if equal, positive if a > b.
// Plain string comparison is wrong here: '1.10.0' < '1.2.0' as strings.
export function compareVersions(a: string, b: string) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    // A missing part counts as 0, so '1.2' equals '1.2.0'.
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
