interface Category {
  id: number;
  name: string;
  shortname: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  shortname: string;
  description: string;
  price: number;
  image: string;
}

interface CategoryData {
  category: string;
  items: Product[];
}

function getContentEl(): HTMLElement {
  return document.getElementById("content") as HTMLElement;
}

function setLoading(): void {
  getContentEl().innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Завантаження...</p>
    </div>`;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response: Response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP помилка: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function loadCatalog(): Promise<void> {
  setLoading();
  try {
    const categories: Category[] = await fetchJSON<Category[]>("./data/categories.json");
    renderCategoryLinks(categories);
  } catch (err) {
    getContentEl().innerHTML = `<p class="error">Помилка завантаження каталогу: ${err}</p>`;
  }
}

function renderCategoryLinks(categories: Category[]): void {
  const content: HTMLElement = getContentEl();

  const listItems: string = categories
    .map(
      (cat: Category): string => `
      <li>
        <a href="#" class="category-link" data-shortname="${cat.shortname}">
          ${cat.name}
        </a>
        ${cat.notes ? `<span class="notes">${cat.notes}</span>` : ""}
      </li>`
    )
    .join("");

  content.innerHTML = `
    <section class="catalog-section">
      <h2>Каталог товарів</h2>
      <ul class="category-list">
        ${listItems}
        <li>
          <a href="#" id="specials-link" class="category-link specials">
            <b>Specials</b>
          </a>
        </li>
      </ul>
    </section>`;

  const links = document.querySelectorAll<HTMLAnchorElement>(".category-link[data-shortname]");
  links.forEach((link: HTMLAnchorElement): void => {
    link.addEventListener("click", (e: MouseEvent): void => {
      e.preventDefault();
      const shortname: string = link.dataset.shortname as string;
      loadCategory(shortname);
    });
  });

  const specialsLink = document.getElementById("specials-link") as HTMLAnchorElement;
  specialsLink.addEventListener("click", (e: MouseEvent): void => {
    e.preventDefault();
    const randomIndex: number = Math.floor(Math.random() * categories.length);
    const randomCategory: Category | undefined = categories[randomIndex];
    if (randomCategory) {
      loadCategory(randomCategory.shortname);
    }
  });
}

async function loadCategory(shortname: string): Promise<void> {
  setLoading();
  try {
    const data: CategoryData = await fetchJSON<CategoryData>(`./data/${shortname}.json`);
    renderProducts(data);
  } catch (err) {
    getContentEl().innerHTML = `<p class="error">Помилка завантаження категорії: ${err}</p>`;
  }
}

function renderProducts(data: CategoryData): void {
  const content: HTMLElement = getContentEl();

  const productCards: string = data.items
    .map(
      (product: Product): string => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" width="200" height="200" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="description">${product.description}</p>
          <p class="price">${product.price.toLocaleString("uk-UA")} ₴</p>
        </div>
      </div>`
    )
    .join("");

  content.innerHTML = `
    <section class="products-section">
      <h2>${data.category}</h2>
      <button class="back-btn" id="back-to-catalog">← Назад до каталогу</button>
      <div class="products-grid">
        ${productCards}
      </div>
    </section>`;

  const backBtn = document.getElementById("back-to-catalog") as HTMLButtonElement;
  backBtn.addEventListener("click", (): void => {
    loadCatalog();
  });
}

function renderHome(): void {
  getContentEl().innerHTML = `
    <div class="home-section">
      <h2>Ласкаво просимо до нашого каталогу!</h2>
      <p>Обирай найкращі товари серед нашого асортименту.</p>
    </div>`
}

function initNavigation(): void {
  const homeLink = document.getElementById("nav-home") as HTMLAnchorElement;
  const catalogLink = document.getElementById("nav-catalog") as HTMLAnchorElement;

  homeLink.addEventListener("click", (e: MouseEvent): void => {
    e.preventDefault();
    renderHome();
  });

  catalogLink.addEventListener("click", (e: MouseEvent): void => {
    e.preventDefault();
    loadCatalog();
  });
}

function initSubmarineCursor(): void {
  const sub = document.getElementById("cursor-submarine") as HTMLElement | null;
  if (!sub) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  let currentX = targetX;
  let currentY = targetY;

  document.addEventListener("mousemove", (e: MouseEvent): void => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateSubmarine(): void {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    sub!.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px) scale(0.35)`;

    requestAnimationFrame(animateSubmarine);
  }

  animateSubmarine();
}

document.addEventListener("DOMContentLoaded", (): void => {
  initNavigation();
  renderHome();
  initSubmarineCursor();
});