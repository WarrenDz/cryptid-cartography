import './style.css'
import cryptids from './cryptids.js'
import { getMapElement, setLayerVisible, checkProximity } from './proximityCheck.js'
import { ensurePopup, showPopup, hidePopup } from './popUp.js'
import './overviewGlobe.js'
import { getHashValue, getTargetKeyFromHash } from './hashUtils.js'
import { goToBookmarkForTarget } from './bookmarks.js'
import { createGiveUpController } from './giveUpController.js'
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "@arcgis/map-components/components/arcgis-map";

// Load the cryptid data
const TARGETS = cryptids;

// The proximity threshold in meters
const PROXIMITY_METERS = 10000;
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

const applyInitialHashTargetBookmark = (view) => {
  const hashKey = getTargetKeyFromHash(TARGETS);
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
    giveUpController.schedule(targetKey);
  } else {
    giveUpController.clear();
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

const hashTargetKey = getTargetKeyFromHash(TARGETS);
if (hashTargetKey) {
  setSelectedTargetKey(hashTargetKey);
}

toggleHintLayer();