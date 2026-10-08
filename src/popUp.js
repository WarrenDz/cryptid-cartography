// Track visibility so repeated hide requests can be skipped.
let popupVisible = false;

// Reuse the popup or create its markup and clear the initial animation class.
export const ensurePopup = () => {
    let el = document.getElementById('target-popup');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'target-popup';
    el.className = 'target-popup target-popup--init';
    el.innerHTML = `
        <div class="target-popup__card">
            <h3 class="target-popup__title"></h3>
            <p class="target-popup__description"></p>
        </div>
        <div class="target-popup__image-wrap">
            <img class="target-popup__image" alt="" loading="lazy" />
        </div>
    `;

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.remove('target-popup--init'));
    return el;
};

// Populate the popup with the selected cryptid's details and make it visible.
export const showPopup = (target = {}) => {
    const el = ensurePopup();

    const titleEl = el.querySelector('.target-popup__title');
    const descEl = el.querySelector('.target-popup__description');
    const imgEl = el.querySelector('.target-popup__image');

    titleEl.textContent = target.name || '';
    descEl.textContent = target.description || '';

    // Update the image and alternative text, or hide the image when none is provided.
    if (target.image) {
        if (imgEl.getAttribute('src') !== target.image) {
            imgEl.src = target.image;
        }
        imgEl.alt = target.imageAlt || target.name || '';
        imgEl.style.display = '';
    } else {
        imgEl.removeAttribute('src');
        imgEl.alt = target.name || '';
        imgEl.style.display = 'none';
    }

    el.classList.add('target-popup--visible');
    popupVisible = true;
};

// Hide the existing popup without removing its reusable markup.
export const hidePopup = () => {
    if (!popupVisible) return;
    const el = document.getElementById('target-popup');
    if (!el) return;
    el.classList.remove('target-popup--visible');
    popupVisible = false;
};