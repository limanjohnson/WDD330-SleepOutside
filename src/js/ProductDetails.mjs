import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
    const discount = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    const hasDiscount = discount > 0;

    return `<section class="product-detail">
        <h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
        <div class="price-container">
          ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
          <p class="product-card__price">
            Was: <s>$${product.SuggestedRetailPrice.toFixed(2)}</s>
            Now: <strong>$${product.FinalPrice.toFixed(2)}</strong>
          </p>
        </div>
        <p class="product__color">${product.Colors[0].ColorName}</p>
        <p class="product__description">${product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
            <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
    </section>`;
}

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        console.log("loaded product", this.product);
        this.renderProductDetails("main")
        document
            .getElementById("addToCart")
            .addEventListener("click", () => this.addProductToCart(this.product));
    }

    addProductToCart(product) {
        let cartItems = getLocalStorage("so-cart");
        if (!Array.isArray(cartItems)) {
            cartItems = [];
        }
        cartItems.push(product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            productDetailsTemplate(this.product)
        );
    }
}