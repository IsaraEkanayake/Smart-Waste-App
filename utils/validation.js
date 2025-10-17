export function validateBinId(binId) {
  if (!binId || typeof binId !== 'string') return false;
  return /^ID-\d{3,6}$/.test(binId);
}
