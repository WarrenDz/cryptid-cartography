// Decode the URL hash, remove its leading #, and normalize it to lowercase.
export const getHashValue = () => {
  return decodeURIComponent(window.location.hash || '')
    .replace(/^#/, '')
    .toLowerCase();
};

// Resolve a target key from either its base hash or a hint-prefixed hash.
export const getTargetKeyFromHash = (targets, hashValue = getHashValue()) => {
  if (!targets || !hashValue) return null;

  for (const key of Object.keys(targets)) {
    if (hashValue === key || hashValue.startsWith(`${key}-hint`)) {
      return key;
      console.log(`Matched target key from hash: ${key}`); 
    }
  }

  return null;
};
