import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Convert form data to JSON
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 12;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotal) {
      subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    this.tax = 16.20; // Static for this assignment
    const orderTotalEl = document.querySelector(`${this.outputSelector} #orderTotal`);
    this.orderTotal = (this.itemTotal + this.shipping + this.tax).toFixed(2);
    if (orderTotalEl) {
      orderTotalEl.innerText = `$${this.orderTotal}`;
    }
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1
    }));
  }

  async checkout() {
    const form = document.forms[0];
    const formData = formDataToJSON(form);

    const order = {
      ...formData,
      orderDate: new Date().toISOString(),
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    };

    try {
      const response = await fetch("https://wdd330-backend.onrender.com:3000/checkout", options);
      const result = await response.json();
      console.log("Order submitted:", result);
      // Optionally: redirect to confirmation page
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  }
}
