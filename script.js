const icons = ['✚', '◷', '⌁', '♡'];
const whatsappUrl = 'https://wa.me/201007600461';

if (!document.querySelector('link[href="/overrides.css"]')) {
  const overrides = document.createElement('link');
  overrides.rel = 'stylesheet';
  overrides.href = '/overrides.css';
  document.head.append(overrides);
}
if (!document.querySelector('link[href="/task17.css"]')) {
  const productStyles = document.createElement('link');
  productStyles.rel = 'stylesheet';
  productStyles.href = '/task17.css';
  document.head.append(productStyles);
}
if (!document.querySelector('link[href="/polish.css"]')) {
  const polishStyles = document.createElement('link');
  polishStyles.rel = 'stylesheet';
  polishStyles.href = '/polish.css';
  document.head.append(polishStyles);
}
if (!document.querySelector('link[href="/product-card-polish.css"]')) {
  const cardStyles = document.createElement('link');
  cardStyles.rel = 'stylesheet';
  cardStyles.href = '/product-card-polish.css';
  document.head.append(cardStyles);
}
if (!document.querySelector('link[href="/final-touches.css"]')) {
  const finalStyles = document.createElement('link');
  finalStyles.rel = 'stylesheet';
  finalStyles.href = '/final-touches.css';
  document.head.append(finalStyles);
}
document.documentElement.dir = 'rtl';
document.querySelectorAll('.year').forEach((year) => { year.textContent = new Date().getFullYear(); });

const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  }));
}

function productCard(product, index) {
  const visual = product.image
    ? `<img loading="lazy" src="/${encodeURI(product.image)}" alt="${product.name}">`
    : `<span aria-hidden="true">${icons[index % icons.length]}</span>`;
  return `<a class="product-link" href="/products/${product.slug}/" aria-label="عرض تفاصيل ${product.name}"><article class="product-card"><div class="product-img">${visual}</div><div class="product-body"><span class="category">${product.category}</span><h3>${product.name}</h3><p>${product.description}</p>${product.specs ? `<div class="specs">${product.specs}</div>` : ''}</div></article></a>`;
}

async function getProducts() {
  const response = await fetch('/products.json?v=2', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load products');
  return response.json();
}

async function loadProducts() {
  const grid = document.querySelector('.product-grid');
  const featured = document.querySelector('.featured-grid');
  if (!grid && !featured) return;
  try {
    const products = await getProducts();
    if (grid) grid.innerHTML = products.map(productCard).join('');
    if (featured) featured.innerHTML = products.slice(0, 4).map(productCard).join('');
  } catch {
    [grid, featured].filter(Boolean).forEach((element) => {
      element.innerHTML = '<p class="load-error">تعذّر تحميل المنتجات حالياً.</p>';
    });
  }
}

async function loadProductDetail() {
  const detailPage = document.querySelector('[data-product-detail]');
  if (!detailPage) return;
  const slug = detailPage.dataset.productDetail;
  const main = document.querySelector('.detail-page');
  try {
    const products = await getProducts();
    const product = products.find((item) => item.slug === slug);
    if (!product) throw new Error('Product not found');
    const specs = product.specs.split('|').map((spec) => `<li>${spec.trim()}</li>`).join('');
    main.innerHTML = `<a class="product-breadcrumb" href="/products/">← العودة إلى المنتجات</a><article class="product-detail"><div class="detail-image"><img src="/${encodeURI(product.image)}" alt="${product.name}"></div><div class="detail-copy"><span class="category">${product.category}</span><h1>${product.name}</h1><p>${product.description}</p><ul class="spec-list">${specs}</ul><a class="btn order-btn" href="${whatsappUrl}" target="_blank" rel="noopener">اطلب الآن عبر واتساب <b aria-hidden="true">←</b></a></div></article>`;
    document.title = `Care Pro | ${product.name}`;
  } catch {
    main.innerHTML = '<p class="load-error">تعذّر العثور على هذا المنتج. <a href="/products/">العودة إلى المنتجات</a></p>';
  }
}

loadProducts();
loadProductDetail();

if (!document.querySelector('[data-contact-fab]')) {
  document.body.insertAdjacentHTML('beforeend', '<div class="contact-fab" data-contact-fab><button class="fab-main" type="button" aria-expanded="false" aria-controls="fab-actions"><span>تواصل معنا</span><b aria-hidden="true">＋</b></button><div class="fab-actions" id="fab-actions"><a class="fab-action fab-call" href="tel:01050861901"><span>01050861901</span><b aria-hidden="true">☎</b></a><a class="fab-action fab-whatsapp" href="https://wa.me/201007600461" target="_blank" rel="noopener"><span>01050861901</span><b aria-hidden="true">◔</b></a><a class="fab-action fab-email" href="mailto:careproco@gmail.com"><span>careproco@gmail.com</span><b aria-hidden="true">✉</b></a></div></div>');
}
const contactFab = document.querySelector('[data-contact-fab]');
if (contactFab) {
  const whatsapp = contactFab.querySelector('.fab-whatsapp');
  whatsapp.href = whatsappUrl;
  const trigger = contactFab.querySelector('.fab-main');
  const setFabState = (open) => {
    contactFab.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', () => setFabState(!contactFab.classList.contains('is-open')));
  contactFab.addEventListener('mouseenter', () => setFabState(true));
  contactFab.addEventListener('mouseleave', () => setFabState(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setFabState(false);
  });
}

document.querySelectorAll('[data-counter]').forEach((counter) => {
  const target = Number(counter.dataset.counter);
  const renderCount = () => {
    const startedAt = performance.now();
    const draw = (now) => {
      const progress = Math.min((now - startedAt) / 1200, 1);
      counter.textContent = `+${Math.round(target * (1 - (1 - progress) ** 3))}`;
      if (progress < 1) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      renderCount();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(counter);
});
