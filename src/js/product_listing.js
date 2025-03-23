import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount, loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category");
const searchTerm = getParam("search");

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init();

// display cart count
updateCartCount();

// load header and footer
loadHeaderFooter();
