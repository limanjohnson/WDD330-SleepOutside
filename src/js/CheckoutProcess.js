import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

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

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal",
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items",
    );
    itemNumElement.innerText = this.list.length;

    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    ).toFixed(2);

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];

    const json = formDataToJSON(formElement);
    // add totals, and item details
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    // ✅ Log BEFORE the try block
    // console.log("Payload sent to server:", json);

    try {
      const res = await services.checkout(json);
      // console.log(res);
      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
    } catch (err) {
      // Remove any pre-existing alerts
      removeAllAlerts();

      // Show each error message from the server response
      if (err.name === "servicesError") {
        for (let key in err.message) {
          alertMessage(`${key}: ${err.message[key]}`);
        }
      } else {
        // console.error("Unexpected error:", err);
        alertMessage("An unexpected error occurred. Please try again.");
      }
    }
  }
}
