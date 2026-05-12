"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getContentEl() {
    return document.getElementById("content");
}
function setLoading() {
    getContentEl().innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Завантаження...</p>
    </div>`;
}
function fetchJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP помилка: ${response.status}`);
        }
        return response.json();
    });
}
function loadCatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        setLoading();
        try {
            const categories = yield fetchJSON("./data/categories.json");
            renderCategoryLinks(categories);
        }
        catch (err) {
            getContentEl().innerHTML = `<p class="error">Помилка завантаження каталогу: ${err}</p>`;
        }
    });
}
function renderCategoryLinks(categories) {
    const content = getContentEl();
    const listItems = categories
        .map((cat) => `
      <li>
        <a href="#" class="category-link" data-shortname="${cat.shortname}">
          ${cat.name}
        </a>
        ${cat.notes ? `<span class="notes">${cat.notes}</span>` : ""}
      </li>`)
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
    const links = document.querySelectorAll(".category-link[data-shortname]");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const shortname = link.dataset.shortname;
            loadCategory(shortname);
        });
    });
    const specialsLink = document.getElementById("specials-link");
    specialsLink.addEventListener("click", (e) => {
        e.preventDefault();
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        if (randomCategory) {
            loadCategory(randomCategory.shortname);
        }
    });
}
function loadCategory(shortname) {
    return __awaiter(this, void 0, void 0, function* () {
        setLoading();
        try {
            const data = yield fetchJSON(`./data/${shortname}.json`);
            renderProducts(data);
        }
        catch (err) {
            getContentEl().innerHTML = `<p class="error">Помилка завантаження категорії: ${err}</p>`;
        }
    });
}
function renderProducts(data) {
    const content = getContentEl();
    const productCards = data.items
        .map((product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" width="200" height="200" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="description">${product.description}</p>
          <p class="price">${product.price.toLocaleString("uk-UA")} ₴</p>
        </div>
      </div>`)
        .join("");
    content.innerHTML = `
    <section class="products-section">
      <h2>${data.category}</h2>
      <button class="back-btn" id="back-to-catalog">← Назад до каталогу</button>
      <div class="products-grid">
        ${productCards}
      </div>
    </section>`;
    const backBtn = document.getElementById("back-to-catalog");
    backBtn.addEventListener("click", () => {
        loadCatalog();
    });
}
function renderHome() {
    getContentEl().innerHTML = `
    <div class="home-section">
      <h2>Ласкаво просимо до нашого каталогу!</h2>
      <p>Обирай найкращі товари серед нашого асортименту.</p>
    </div>`;
}
function initNavigation() {
    const homeLink = document.getElementById("nav-home");
    const catalogLink = document.getElementById("nav-catalog");
    homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        renderHome();
    });
    catalogLink.addEventListener("click", (e) => {
        e.preventDefault();
        loadCatalog();
    });
}
function initSubmarineCursor() {
    const sub = document.getElementById("cursor-submarine");
    if (!sub)
        return;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    function animateSubmarine() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        sub.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px) scale(0.35)`;
        requestAnimationFrame(animateSubmarine);
    }
    animateSubmarine();
}
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    renderHome();
    initSubmarineCursor();
});
//# sourceMappingURL=script.js.map