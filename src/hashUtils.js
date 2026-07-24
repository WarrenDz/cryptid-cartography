export const getHashValue = () => {
  return decodeURIComponent(window.location.hash || '')
    .replace(/^#/, '')
    .toLowerCase();
};

export const getTargetKeyFromHash = (targets, hashValue = getHashValue()) => {
  if (!targets || !hashValue) return null;

  for (const key of Object.keys(targets)) {
    if (hashValue === key || hashValue.startsWith(`${key}-hint`)) {
      return key;
    }
  }

  return null;
};
