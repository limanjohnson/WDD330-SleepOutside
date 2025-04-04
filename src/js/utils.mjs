// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// helper to get parameter from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterBegin",
  clear = false
) {
  const useHtmlTemplate = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, useHtmlTemplate.join(""));
}

// render header and footer
export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  // parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch the content of an HTML file from given path
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.getElementById("main-header")
  renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);

  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.getElementById("main-footer")
  renderWithTemplate(footerTemplate, footerElement);
}


// update the cart count by the cart image
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartIcon = document.querySelector(".cart");
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    if (cartItems.length === 0) {
      cartCountElement.style.display = "none";
    } else {
      cartCountElement.style.display = "block";
      cartCountElement.textContent = cartItems.length;
      cartIcon.id = "shake";
      setTimeout(function() {
        cartIcon.id = "";
      }, 750);
    }
  }
}

export function alertMessage(message, scroll = true) {
  // Create the alert element
  const alert = document.createElement('div');
  alert.classList.add('site-alert'); // Use the existing site-alert class for styling

  // Set the content of the alert (message)
  alert.innerHTML = `
    <span class="site-alert__message">${message}</span>
    <button class="site-alert__close" aria-label="Close alert">×</button>
  `;

  // Add a click listener to remove the alert if the user clicks the close button
  alert.addEventListener('click', function (e) {
    if (e.target.classList.contains('site-alert__close')) {
      alert.remove();
    }
  });

  // Add the alert to the top of the main element
  const main = document.querySelector('main');
  main.prepend(alert);

  // Optionally scroll the page to the top to make sure the user sees the error
  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  // placeholder: add implementation if needed later
  console.log("removeAllAlerts called (placeholder)");
}