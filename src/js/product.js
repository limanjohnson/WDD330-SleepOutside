<<<<<<< HEAD
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
=======
import { getParam } from "./utils.mjs";
>>>>>>> bb0f969100f39fdecaf560e86f96a17cb9356a20
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

<<<<<<< HEAD
function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart");
  if (cartItems == null) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
=======
const product = new ProductDetails(productId, dataSource);
product.init();
>>>>>>> bb0f969100f39fdecaf560e86f96a17cb9356a20
