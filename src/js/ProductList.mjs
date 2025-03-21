import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

// Template for each product card
function productCardTemplate(product) {
  const discount = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
  );
  const hasDiscount = discount > 0;

  return `<li class="product-card">
    <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>

    <div class="price-container">
      ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
      <p class="product-card__price">
        ${hasDiscount ? `Was: <s>$${product.SuggestedRetailPrice.toFixed(2)}</s><br>` : ""}
        Now: <strong>$${product.FinalPrice.toFixed(2)}</strong>
      </p>
    </div>

    <button class="add-to-cart-btn" data-id="${product.Id}">Add to Cart</button>
  </li>`;
}

// Main class to render the product list
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData(this.category);
    this.renderList(products);
    this.addCartEventListeners(products);
  }

  renderList(productList) {
    this.listElement.innerHTML = productList
      .map(product => productCardTemplate(product))
      .join("");
  }

  addCartEventListeners(products) {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
      button.addEventListener("click", () => {
        const productId = button.dataset.id;
        const product = products.find(p => p.Id === productId);

        let cart = getLocalStorage("so-cart") || [];
        cart.push(product);
        setLocalStorage("so-cart", cart);
        updateCartCount();

        // ✅ Redirect to the cart page
        window.location.href = "/cart/index.html";
      });
    });
  }
}
