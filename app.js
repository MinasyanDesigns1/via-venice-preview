const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { mobileMenu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = 'Menu'; }
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; mobileMenu.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.textContent = open ? 'Close' : 'Menu'; });
mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); } });

const serviceMenu = {
  nails: {
    title: 'Nails', kicker: 'MANICURES & PEDICURES', description: 'Waterless nail care, from a clean natural finish to your signature set.',
    groups: [
      ['Manicures & pedicures', [['Manicure, no polish', '$40'], ['Pedicure, no polish', '$50'], ['Nail polish', '$20'], ['Gel manicure', '$80'], ['Gel pedicure', '$80'], ['Hard gel signature manicure', '$110']]],
      ['Extensions & refills', [['Hard gel extensions', '$120'], ['Gel X extensions', '$100'], ['Hard gel refill', '$100'], ['Gel X refill', '$80']]],
      ['Make it yours', [['Hard gel overlay', '$20'], ['Chrome, pearl, French, ombré or cat eye design', '$20'], ['Double French tips', '$30'], ['Hand-painted design', '$5 / nail'], ['Nail stamping or sticker', '$1 / nail'], ['Foot treatment', '$10']]],
      ['Removal & appointment options', [['Regular polish removal', '$5'], ['Gel removal', '$10'], ['Extension removal', '$20'], ['Simultaneous manicure & pedicure', '+$10'], ['Top artist', '+$20']]]
    ],
    note: 'Refills are offered within three weeks. A set from another salon may require removal and a new set. Removal of your previous Via Venice set is complimentary when repeating the same service; standalone removal excludes manicure, filing and shaping. Nail repairs and individual extensions are also available—ask the salon for the applicable price. Confirm options and prices when booking.'
  },
  brows: {
    title: 'Brows', kicker: 'SHAPE, TINT & LAMINATE', description: 'Shaping, tinting and lamination, with brow mapping to guide your look.',
    groups: [
      ['Shape & color', [['Brow shaping', '$40'], ['Brow tinting', '$40'], ['Brow henna', '$40'], ['Shaping & tinting', '$69']]],
      ['Lamination', [['Brow lamination', '$90'], ['Lamination & tinting', '$120'], ['Lamination, tinting & shaping', '$150']]],
      ['Removal', [['Brow tint removal', '$10']]]
    ],
    note: 'Looking for brows and lashes together? Explore our brow & lash pairings. See online booking for current promotions and availability.'
  },
  lashes: {
    title: 'Lashes', kicker: 'LIFTS & EXTENSIONS', description: 'From the lift of your natural lashes to a full extension set. Choose your level of definition.',
    groups: [
      ['Lift & tint', [['Lash tinting', '$30'], ['Lash lift', '$80'], ['Lash lift & tint', '$110']]],
      ['Extension sets', [['Classic / 1D', '$150'], ['Cat eyes / 2D', '$170'], ['Foxy eyes / 2D', '$170'], ['Volume / 3D', '$200'], ['Mega volume / 4D+', '$300'], ['Hybrid', '$200'], ['Anime', '$200'], ['Color lashes', 'From $10']]],
      ['Refills', [['Classic', '$100'], ['Cat eyes or foxy eyes', '$120'], ['Volume, hybrid or anime', '$150'], ['Mega volume', '$200']]],
      ['Removal', [['Extension removal', '$30'], ['Tint removal', '$10']]]
    ],
    note: 'Refills are offered within three weeks. New clients with fewer than 40% of their extensions remaining may need a new set. Previous Via Venice extensions are removed without charge when getting a new set. See booking for current promotions and availability.'
  },
  makeup: {
    title: 'Makeup & hair', kicker: 'FOR YOUR OCCASION', description: 'The finishing touches for an everyday moment, a special evening or your wedding day.',
    groups: [
      ['Makeup & hair together', [['Everyday makeup & hairstyle', '$300'], ['Celebrity makeup & hairstyle', '$350'], ['Wedding makeup & hairstyle', '$550']]],
      ['Individual services', [['Wedding makeup', '$300'], ['Wedding hair design', '$300'], ['Formal hair design', '$200']]]
    ],
    note: 'House calls are available with an additional fee. Please contact the salon to discuss your location, occasion and quote.'
  },
  waxing: {
    title: 'Face waxing', kicker: 'FACIAL WAXING', description: 'Facial waxing for cheeks, chin or the full face.',
    groups: [['Face', [['Cheeks', '$15'], ['Chin', '$15'], ['Full face', '$60']]]],
    note: 'For eyebrow shaping, explore our brow menu. Please confirm the right service and current price when booking.'
  },
  combos: {
    title: 'Brows & lashes', kicker: 'BROWS & LASHES', description: 'Brow lamination and lash lift combinations, with tinting and shaping options.',
    groups: [['Brow lamination & lash lift', [['Lamination & lift, without tint or shaping', '$129'], ['Lamination & lift, both with tint', '$169'], ['Brow lamination, tint & shape + lash lift & tint', '$209']]]],
    note: 'These prices reflect the pairings listed on our menu. Check online booking for current offers and appointment availability.'
  }
};

const dialog = document.querySelector('#service-dialog');
const list = document.querySelector('#dialog-services');
let lastServiceTrigger;
document.querySelectorAll('[data-service]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const menu = serviceMenu[trigger.dataset.service];
    if (!menu) return;
    lastServiceTrigger = trigger;
    document.querySelector('#dialog-title').textContent = menu.title;
    document.querySelector('#dialog-kicker').textContent = menu.kicker;
    document.querySelector('#dialog-description').textContent = menu.description;
    document.querySelector('#dialog-note').textContent = menu.note;
    list.replaceChildren();
    for (const [heading, services] of menu.groups) {
      const section = document.createElement('section'); section.className = 'menu-group';
      const title = document.createElement('h3'); title.textContent = heading;
      const items = document.createElement('dl');
      for (const [name, price] of services) {
        const row = document.createElement('div');
        const label = document.createElement('dt'); label.textContent = name;
        const value = document.createElement('dd'); value.textContent = price;
        row.append(label, value); items.append(row);
      }
      section.append(title, items); list.append(section);
    }
    dialog.showModal(); dialog.scrollTop = 0;
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => lastServiceTrigger?.focus({ preventScroll: true }));
document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());


// One selector owns the picture, menu excerpt and selected state.
const treatmentTabs = Array.from(document.querySelectorAll('[data-treatment]'));
function selectTreatment(tab) {
  treatmentTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
treatmentTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTreatment(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % treatmentTabs.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + treatmentTabs.length - 1) % treatmentTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = treatmentTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); selectTreatment(treatmentTabs[next]); treatmentTabs[next].focus();
  });
});


// Keep the tab semantics aligned with the visible layout.
const compactMenu = matchMedia('(max-width: 980px)');
function syncTabOrientation() {
 document.querySelector('.treatment-controls').setAttribute('aria-orientation', compactMenu.matches ? 'horizontal' : 'vertical');
}
syncTabOrientation();
compactMenu.addEventListener('change', syncTabOrientation);
