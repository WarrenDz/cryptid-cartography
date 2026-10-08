// Configure the delayed give-up button with target, hash, and reveal callbacks.
export const createGiveUpController = ({
  delayMs = 3000,
  buttonId = 'give-up-button',
  getCurrentTargetKey,
  getHashValue,
  onGiveUp,
}) => {
  let timerId = null;

  // Cancel a pending display timer and remove any existing button.
  const clearTimer = () => {
    if (!timerId) return;
    window.clearTimeout(timerId);
    timerId = null;
  };

  const removeButton = () => {
    const existing = document.getElementById(buttonId);
    if (existing) existing.remove();
  };

  // Create the button and connect its click to the supplied reveal callback.
  const showButton = (targetKey) => {
    removeButton();

    const button = document.createElement('button');
    button.id = buttonId;
    button.type = 'button';
    button.textContent = 'Give up?';
    button.className = 'give-up-button';

    button.addEventListener('click', async () => {
      if (typeof onGiveUp === 'function') {
        await onGiveUp(targetKey);
      }
    });

    document.body.appendChild(button);
  };

  // Reset both the pending timer and the visible button.
  const clear = () => {
    clearTimer();
    removeButton();
  };

  // After the delay, show the button only if this target's final hint is still active.
  const schedule = (targetKey) => {
    clear();

    timerId = window.setTimeout(() => {
      timerId = null;

      if (typeof getCurrentTargetKey === 'function' && getCurrentTargetKey() !== targetKey) {
        return;
      }

      if (typeof getHashValue === 'function' && getHashValue() !== `${targetKey}-hint3`) {
        return;
      }

      showButton(targetKey);
    }, delayMs);
  };

  // Expose scheduling and cleanup to the application.
  return {
    schedule,
    clear,
  };
};
