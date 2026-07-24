let popupVisible = false;

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

export const showPopup = (target = {}) => {
    const el = ensurePopup();

    const titleEl = el.querySelector('.target-popup__title');
    const descEl = el.querySelector('.target-popup__description');
    const imgEl = el.querySelector('.target-popup__image');

    titleEl.textContent = target.name || '';
    descEl.textContent = target.description || '';

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

export const hidePopup = () => {
    if (!popupVisible) return;
    const el = document.getElementById('target-popup');
    if (!el) return;
    el.classList.remove('target-popup--visible');
    popupVisible = false;
};