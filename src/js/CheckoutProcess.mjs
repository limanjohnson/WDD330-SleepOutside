import {getLocalStorage} from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  async init() {
    this.list = getLocalStorage(this.key);
    this.renderCheckoutProductList();
    this.calculateOrderTotal();
  }


  renderCheckoutProductList() {
    const cartItems = getLocalStorage("so-cart");
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
      const cartFooter = document.querySelector(".cart-footer");
      const totalDisplay = cartFooter.querySelector(".cart-total");
      totalDisplay.textContent = `${total.toFixed(2)}`;
      cartFooter.classList.remove("hide");

    }
    function cartItemTemplate(item) {
      return`
  <li class="checkout-product-list">
    <p>${item.NameWithoutBrand}</p>
    <p>${item.FinalPrice}</p>
  </li>`
    }

  }

  calculateOrderTotal() {
    // const zipCode = document.querySelector("#zip").value;

    document.querySelector("#zip").addEventListener("input", (event) => {
      const zipCode = event.target.value;

      // Validate zip code: only allow 5 numerical digits
      if (/^\d{5}$/.test(zipCode)) {
        // Valid zip code
        event.target.classList.remove("error");
        // Optionally enable functionality here
      } else {
        // Invalid zip code
        event.target.classList.add("error");

      }
      if (zipCode.length !== 5) {
        return "";
      } else {
        calculateSalesTax();
        calculateShipping();
        calculateTotal();
      }
      function calculateSalesTax() {
        const cartItems = getLocalStorage("so-cart");
        const total = (cartItems.reduce((sum, item) => sum + item.FinalPrice, 0)) * .06;
        const salesTax = document.querySelector("#tax");
        salesTax.textContent = `${total.toFixed(2)}`;
      }

      function calculateShipping() {
        const cartItems = getLocalStorage("so-cart") || [];
        const numberOfItems = cartItems.length;
        const shipping = document.querySelector("#shipping");
        if (numberOfItems < 1) {
          shipping.textContent = 0;
          return;
        }
        shipping.textContent = `${10 + (numberOfItems - 1) * 2}`;
      }

      function calculateTotal() {
        const subtotal = parseFloat(document.querySelector(".cart-total").textContent);
        const tax = parseFloat(document.querySelector("#tax").textContent);
        const shipping = parseFloat(document.querySelector("#shipping").textContent);
        const total = document.querySelector("#total");
        total.textContent = `$${(subtotal + tax + shipping).toFixed(2)}`;

      }
    });



  }


}
