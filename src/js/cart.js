import {
  getLocalStorage,
  updateCartCount,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs";

// Template to render each cart item (includes quantity input)
function cartItemTemplate(item) {
  const colorName = item.Colors?.[0]?.ColorName || "No Color";
  const quantity = item.quantity || 1;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="Image of ${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>

    <label>
      Qty:
      <input type="number" class="cart-item-quantity" data-id="${item.Id}" value="${quantity}" min="1">
    </label>

    <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
    <button class="remove-item-button" data-id="${item.Id}">Remove</button>
  </li>`;
}

// Function to render cart contents (items and totals)
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Show cart total if cart is not empty
  if (cartItems.length > 0) {
    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0,
    );
    const cartFooter = document.querySelector(".cart-footer");
    const totalDisplay = cartFooter.querySelector(".cart-total");
    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  }

  // Reinitialize event listeners after rendering
  removeItemFromCartListener();
  setupQuantityChangeListener(); // ✅ Add quantity listeners
}

// Function to update cart item quantity
function updateCartItemQuantity(itemId, newQuantity) {
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.map((item) => {
    if (item.Id === itemId) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

// Listener for quantity input changes
function setupQuantityChangeListener() {
  document.querySelectorAll(".cart-item-quantity").forEach((input) => {
    input.addEventListener("change", (event) => {
      const itemId = event.target.dataset.id;
      const newQuantity = parseInt(event.target.value, 10);

      if (!isNaN(newQuantity) && newQuantity >= 1) {
        updateCartItemQuantity(itemId, newQuantity);
      } else {
        // If invalid, reset to 1 and update again
        event.target.value = 1;
        updateCartItemQuantity(itemId, 1);
      }
    });
  });
}

// Remove item from cart by ID
function removeItemFromCart(itemId) {
  let cartItems = getLocalStorage("so-cart");

  if (cartItems && cartItems.length > 0) {
    cartItems = cartItems.filter((item) => item.Id !== itemId);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCount();
  }
}

// Listener for remove button clicks
function removeItemFromCartListener() {
  document.querySelectorAll(".remove-item-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.dataset.id;
      removeItemFromCart(itemId);
    });
  });
}

// Initial rendering on page load
renderCartContents();
updateCartCount();
loadHeaderFooter();
