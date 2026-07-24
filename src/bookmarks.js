export const findBookmarkByName = (map, name) => {
  if (!map || !name) return null;

  const bookmarks = map.bookmarks?.items || map.bookmarks || [];
  const normalizedName = String(name).toLowerCase();

  for (const bookmark of bookmarks) {
    if (String(bookmark?.name || '').toLowerCase() === normalizedName) {
      return bookmark;
    }
  }

  return null;
};

export const goToBookmarkForTarget = async (view, target, suffix = '') => {
  if (!view || !target?.name) return false;

  const bookmarkName = `${target.name}${suffix}`;
  const bookmark = findBookmarkByName(view.map, bookmarkName);
  if (!bookmark) return false;

  const goToTarget = bookmark.viewpoint || bookmark.extent || null;
  if (!goToTarget) return false;

  try {
    await view.goTo(goToTarget, { animate: true, duration: 1000 });
    return true;
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.warn(`Failed to goTo bookmark for ${target.name}:`, error);
    }
    return false;
  }
};
