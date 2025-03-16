import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";

const dataSource = new ProductData("tents");
const unorderedList = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, unorderedList);

productList.init();

// display cart count
updateCartCount();