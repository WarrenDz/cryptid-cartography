// Styles, application helpers, and ArcGIS component registration.
import './style.css'
import cryptids from './cryptids.js'
import { getMapElement, setLayerVisible, checkProximity } from './proximityCheck.js'
import { ensurePopup, showPopup, hidePopup } from './popUp.js'
import './overviewGlobe.js'
import { getHashValue, getTargetKeyFromHash } from './hashUtils.js'
import { goToBookmarkByName, goToBookmarkForTarget } from './bookmarks.js'
import { createGiveUpController } from './giveUpController.js'
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "@arcgis/map-components/components/arcgis-map";

// Cryptid configuration and active target selection.
const TARGETS = cryptids;

const GIVE_UP_DELAY_MS = 3000;

let selectedTargetKey = Object.keys(TARGETS)[0] || null;

const getSelectedTargetKey = () => selectedTargetKey;

const setSelectedTargetKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  const normalized = key.toLowerCase();
  if (!TARGETS[normalized]) return false;
  selectedTargetKey = normalized;
  return true;
};

// Offer a reveal bookmark after the final hint's delay.
const giveUpController = createGiveUpController({
  delayMs: GIVE_UP_DELAY_MS,
  getCurrentTargetKey: getSelectedTargetKey,
  getHashValue,
  onGiveUp: async (targetKey) => {
    const view = getMapElement()?.view;
    const target = TARGETS[targetKey];
    if (!view || !target) return;

    await goToBookmarkForTarget(view, target, '-reveal');
  },
});

// Navigate to the bookmark named by the current URL hash.
const applyHashBookmark = (view) => {
  return goToBookmarkByName(view, getHashValue());
};

// Show only the active target's matching hint and manage the reveal timer.
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
  const hint3Hash = `${baseHash}-hint3`;

  const showHint1 = hashValue === hint1Hash;
  const showHint2 = hashValue === hint2Hash;
  const showHint3 = hashValue === hint3Hash;

  let updated = false;

  if (target.hint1) {
    updated = setLayerVisible(target.hint1, showHint1) || updated;
    console.log(`Hint 1 visibility for ${targetKey}: ${showHint1}`);
  }

  if (target.hint2) {
    updated = setLayerVisible(target.hint2, showHint2) || updated;
    console.log(`Hint 2 visibility for ${targetKey}: ${showHint2}`);
  }

  if (target.hint3) {
    updated = setLayerVisible(target.hint3, showHint3) || updated;
    console.log(`Hint 3 visibility for ${targetKey}: ${showHint3}`);
  }

  if (showHint3) {
    giveUpController.schedule(targetKey);
  } else {
    giveUpController.clear();
  }

  return updated;
};

// Resolve the active cryptid and update its popup and layer on proximity changes.
const getSelectedTarget = () => {
  return TARGETS[getSelectedTargetKey()] || TARGETS[Object.keys(TARGETS)[0]];
};

let lastProximityState = null;

const checkProximityAndUpdate = () => {
  const view = getMapElement()?.view;
  const targetKey = getSelectedTargetKey();
  const target = getSelectedTarget();
  if (!view || !target) return;

  const result = checkProximity({ view, target });
  if (!result) return;

  if (lastProximityState?.targetKey === targetKey &&
    lastProximityState.isNear === result.isNear) return;

  if (result.isNear) {
    showPopup(target);
  } else {
    hidePopup();
  }
  setLayerVisible(targetKey, result.isNear);
  lastProximityState = { targetKey, isNear: result.isNear };
};

// Watch map movement and apply the initial hint and bookmark when the view is ready.
const attachViewListeners = () => {
  const view = getMapElement()?.view;

  if (!view) {
    return false;
  }

  view.watch("center", checkProximityAndUpdate);
  view.when(() => {
    toggleHintLayer();
    return applyHashBookmark(view);
  });
  checkProximityAndUpdate();
  ensurePopup();
  return true;
};

// Retry listener setup until the map component exposes its view.
if (!attachViewListeners()) {
  const intervalId = window.setInterval(() => {
    if (attachViewListeners()) {
      window.clearInterval(intervalId);
    }
  }, 100);
}

// Synchronize target selection, visibility, and navigation when the hash changes.
window.addEventListener('hashchange', () => {
  const hashTargetKey = getTargetKeyFromHash(TARGETS);
  if (hashTargetKey && hashTargetKey !== getSelectedTargetKey()) {
    setLayerVisible(getSelectedTargetKey(), false);
    setSelectedTargetKey(hashTargetKey);
  }

  toggleHintLayer();
  checkProximityAndUpdate();

  const view = getMapElement()?.view;
  if (view) {
    view.when(() => applyHashBookmark(view));
  }
});

// Select the initial target from the URL and attempt its hint visibility update.
const hashTargetKey = getTargetKeyFromHash(TARGETS);
if (hashTargetKey) {
  setSelectedTargetKey(hashTargetKey);
}

toggleHintLayer();