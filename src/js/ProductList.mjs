import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const discount = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
  const hasDiscount = discount > 0;

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.Name}</h2>
    </a>
    <div class="price-container">
      ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
      <p class="product-card__price">
        ${hasDiscount ? `<s>$${product.SuggestedRetailPrice.toFixed(2)}</s> ` : ""}
        <strong>$${product.FinalPrice.toFixed(2)}</strong>
      </p>
    </div>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}