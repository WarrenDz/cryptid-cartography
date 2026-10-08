// Find a bookmark by case-insensitive name in the map's bookmark collection.
export const findBookmarkByName = (map, name) => {
  if (!map || !name) return null;

  const bookmarks = map.bookmarks?.items || map.bookmarks || [];
  const normalizedName = String(name).toLowerCase();

  for (const bookmark of bookmarks) {
    if (String(bookmark?.name || '').toLowerCase() === normalizedName) {
      console.log(`Found bookmark by name: ${bookmark?.name}`);
      return bookmark;
    }
  }

  return null;
};

// Animate to the bookmark's viewpoint or extent, handling navigation failures.
export const goToBookmarkByName = async (view, bookmarkName) => {
  if (!view || !bookmarkName) return false;

  const bookmark = findBookmarkByName(view.map, bookmarkName);
  if (!bookmark) return false;

  const goToTarget = bookmark.viewpoint || bookmark.extent || null;
  if (!goToTarget) return false;

  try {
    await view.goTo(goToTarget, { animate: true, duration: 1000 });
    return true;
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.warn(`Failed to goTo bookmark for ${bookmarkName}:`, error);
    }
    return false;
  }
};

// Build a bookmark name from the cryptid's display name and an optional suffix.
export const goToBookmarkForTarget = async (view, target, suffix = '') => {
  if (!target?.name) return false;

  return goToBookmarkByName(view, `${target.name}${suffix}`);
};
