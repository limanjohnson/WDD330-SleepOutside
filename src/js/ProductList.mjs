import { renderListWithTemplate } from "./utils.mjs";
import { getParam } from "./utils.mjs";

function productCardTemplate(product) {
  const discount = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
  );
  const hasDiscount = discount > 0;

  return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      
      <div class="price-container">
        ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
        <p class="product-card__price">
          ${hasDiscount ? `<s>$${product.SuggestedRetailPrice.toFixed(2)}</s> ` : ""}
          <strong>$${product.FinalPrice.toFixed(2)}</strong>
        </p>
      </div>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.originalList = []
    // this.includedIds = ["880RR", "985RF", "985PR", "344YJ"];
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.originalList = list;

    // If a search term exists, filter the list, otherwise use the full list
    this.renderList(list);

    // Handle when the category is null or undefined
    const titleElement = document.querySelector(".title");

    document.getElementById("sort").addEventListener("change", (e) =>
      this.sortList(e.target.value)
    );
  }

  // filterList(list) {
  //   return list.filter((product) => this.includedIds.includes(product.Id));
  // }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  sortList(criteria) {
    let sortedList = [...this.originalList];

    switch (criteria) {
      case "price-asc":
        sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case "price-des":
        sortedList.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
      case "name-asc":
        sortedList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
        break;
      case "name-des":
        sortedList.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
        break;
      default:
        break;
    }

    this.renderList(sortedList);
  }

}
