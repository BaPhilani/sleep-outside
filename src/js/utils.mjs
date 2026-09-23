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

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate(
    window.location.pathname.includes('/cart/') ||
      window.location.pathname.includes('/checkout/') ||
      window.location.pathname.includes('/product_pages/')
      ? '../partials/header.html'
      : 'partials/header.html'
  );

  const footerTemplate = await loadTemplate(
    window.location.pathname.includes('/cart/') ||
      window.location.pathname.includes('/checkout/') ||
      window.location.pathname.includes('/product_pages/')
      ? '../partials/footer.html'
      : 'partials/footer.html'
  );

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) renderWithTemplate(headerTemplate, headerElement);
  if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}
