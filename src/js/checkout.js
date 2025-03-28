import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.js";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms["checkout"];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    order.checkout();
    window.location.href = "../checkout/success.html"; // clearly redirect on success
  }

  localStorage.clear();

});

function renderCheckoutSummary() {
  const cartItems = getLocalStorage("so-cart") || [];

  const numItemsElement = document.getElementById("num-items");
  const cartTotalElement = document.getElementById("cartTotal");
  const taxElement = document.getElementById("tax");
  const shippingElement = document.getElementById("shipping");
  const orderTotalElement = document.getElementById("orderTotal");

  if (!numItemsElement || !cartTotalElement || !taxElement || !shippingElement || !orderTotalElement) {
    return;
  }

  const numItems = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.FinalPrice * (item.quantity || 1), 0);
  const tax = subtotal * 0.06; // 6% tax
  const shipping = subtotal > 0 ? 10 : 0; // flat $10 shipping
  const total = subtotal + tax + shipping;

  numItemsElement.textContent = numItems;
  cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  orderTotalElement.textContent = `$${total.toFixed(2)}`;
}

renderCheckoutSummary();
