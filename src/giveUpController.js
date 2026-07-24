export const createGiveUpController = ({
  delayMs = 3000,
  buttonId = 'give-up-button',
  getCurrentTargetKey,
  getHashValue,
  onGiveUp,
}) => {
  let timerId = null;

  const clearTimer = () => {
    if (!timerId) return;
    window.clearTimeout(timerId);
    timerId = null;
  };

  const removeButton = () => {
    const existing = document.getElementById(buttonId);
    if (existing) existing.remove();
  };

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

  const clear = () => {
    clearTimer();
    removeButton();
  };

  const schedule = (targetKey) => {
    clear();

    timerId = window.setTimeout(() => {
      timerId = null;

      if (typeof getCurrentTargetKey === 'function' && getCurrentTargetKey() !== targetKey) {
        return;
      }

      if (typeof getHashValue === 'function' && getHashValue() !== `${targetKey}-hint2`) {
        return;
      }

      showButton(targetKey);
    }, delayMs);
  };

  return {
    schedule,
    clear,
  };
};
