import './style.css'
import cryptids from './cryptids.js'
import { getMapElement, setLayerVisible, checkProximity } from './proximityCheck.js'
import { ensurePopup, showPopup, hidePopup } from './popUp.js'
import './overviewGlobe.js'
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "@arcgis/map-components/components/arcgis-map";

// Load the cryptid data
const TARGETS = cryptids;

// The proximity threshold in meters
const PROXIMITY_METERS = 10000;
const GIVE_UP_DELAY_MS = 3000;
const GIVE_UP_BUTTON_ID = 'give-up-button';

let selectedTargetKey = Object.keys(TARGETS)[0] || null;
let giveUpTimerId = null;

const getSelectedTargetKey = () => selectedTargetKey;

const getHashValue = () => {
  return decodeURIComponent(window.location.hash || '')
    .replace(/^#/, '')
    .toLowerCase();
};

const getTargetKeyFromHash = () => {
  const hashValue = getHashValue();
  if (!hashValue) return null;

  for (const key of Object.keys(TARGETS)) {
    if (hashValue === key || hashValue.startsWith(`${key}-hint`)) {
      return key;
    }
  }

  return null;
};

const setSelectedTargetKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  const normalized = key.toLowerCase();
  if (!TARGETS[normalized]) return false;
  selectedTargetKey = normalized;
  return true;
};

const clearGiveUpTimer = () => {
  if (!giveUpTimerId) return;
  window.clearTimeout(giveUpTimerId);
  giveUpTimerId = null;
};

const removeGiveUpButton = () => {
  const existing = document.getElementById(GIVE_UP_BUTTON_ID);
  if (existing) existing.remove();
};

const showGiveUpButton = (targetKey) => {
  removeGiveUpButton();

  const button = document.createElement('button');
  button.id = GIVE_UP_BUTTON_ID;
  button.type = 'button';
  button.textContent = 'Give up';
  button.className = 'give-up-button';

  button.addEventListener('click', async () => {
    const view = getMapElement()?.view;
    const target = TARGETS[targetKey];
    if (!view || !target) return;

    await goToBookmarkForTarget(view, target, '-reveal');
    // removeGiveUpButton();
  });

  document.body.appendChild(button);
};

const scheduleGiveUpButton = (targetKey) => {
  clearGiveUpTimer();
  removeGiveUpButton();

  giveUpTimerId = window.setTimeout(() => {
    giveUpTimerId = null;

    // Avoid showing stale button if target/hash changed during the delay.
    if (getSelectedTargetKey() !== targetKey) return;

    const hashValue = getHashValue();
    if (hashValue !== `${targetKey}-hint2`) return;

    showGiveUpButton(targetKey);
  }, GIVE_UP_DELAY_MS);
};

const findBookmarkByName = (map, name) => {
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

const goToBookmarkForTarget = async (view, target, suffix = '') => {
  if (!view || !target?.name) return false;

  const bookmarkName = `${target.name}${suffix}`;
  const bookmark = findBookmarkByName(view.map, bookmarkName);
  if (!bookmark) return false;

  const goToTarget = bookmark.viewpoint || bookmark.extent || null;
  if (!goToTarget) return false;

  try {
    await view.goTo(goToTarget);
    return true;
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.warn(`Failed to goTo bookmark for ${target.name}:`, error);
    }
    return false;
  }
};

const applyInitialHashTargetBookmark = (view) => {
  const hashKey = getTargetKeyFromHash();
  if (!hashKey) return;

  if (!setSelectedTargetKey(hashKey)) return;

  const target = TARGETS[hashKey];
  if (!target) return;

  // Only auto-goTo for a base hash like #bigfoot, not hint hashes.
  if (getHashValue() !== hashKey) return;

  goToBookmarkForTarget(view, target);
};

const toggleHintLayer = () => {
  const targetKey = getSelectedTargetKey();
  const target = getSelectedTarget();
  if (!targetKey || !target) return false;

  const hashValue = decodeURIComponent(window.location.hash || '')
    .replace(/^#/, '')
    .toLowerCase();

  const baseHash = targetKey.toLowerCase();
  const hint1Hash = `${baseHash}-hint1`;
  const hint2Hash = `${baseHash}-hint2`;

  const showHint1 = hashValue === hint1Hash;
  const showHint2 = hashValue === hint2Hash;

  let updated = false;

  if (target.hint1) {
    updated = setLayerVisible(target.hint1, showHint1) || updated;
  }

  if (target.hint2) {
    updated = setLayerVisible(target.hint2, showHint2) || updated;
  }

  if (showHint2) {
    scheduleGiveUpButton(targetKey);
  } else {
    clearGiveUpTimer();
    removeGiveUpButton();
  }

  return updated;
};

const getSelectedTarget = () => {
  return TARGETS[getSelectedTargetKey()] || TARGETS[Object.keys(TARGETS)[0]];
};

const checkProximityAndUpdate = () => {
  const view = getMapElement()?.view;
  const target = getSelectedTarget();
  if (!view || !target) return;

  checkProximity({
    view,
    target,
    thresholdMeters: PROXIMITY_METERS,
    onNear: () => {
      showPopup(target);
      setLayerVisible(getSelectedTargetKey(), true);
    },
    onFar: () => {
      hidePopup();
      setLayerVisible(getSelectedTargetKey(), false);
    }
  });
};

const attachViewListeners = () => {
  const view = getMapElement()?.view;

  if (!view) {
    return false;
  }

  view.watch("center", checkProximityAndUpdate);
  view.watch("scale", checkProximityAndUpdate);
  view.when(() => applyInitialHashTargetBookmark(view));
  checkProximityAndUpdate();
  ensurePopup();
  return true;
};

if (!attachViewListeners()) {
  const intervalId = window.setInterval(() => {
    if (attachViewListeners()) {
      window.clearInterval(intervalId);
    }
  }, 100);
}

window.addEventListener('hashchange', toggleHintLayer);

const hashTargetKey = getTargetKeyFromHash();
if (hashTargetKey) {
  setSelectedTargetKey(hashTargetKey);
}

toggleHintLayer();