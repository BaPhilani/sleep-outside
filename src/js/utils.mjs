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

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export async function loadHeaderFooter() {
  const isNestedPage =
    window.location.pathname.includes('/cart/') ||
    window.location.pathname.includes('/checkout/') ||
    window.location.pathname.includes('/product_pages/') ||
    window.location.pathname.includes('/product_listing/');

  const headerTemplate = await loadTemplate(
    isNestedPage ? '../partials/header.html' : 'partials/header.html',
  );

  const footerTemplate = await loadTemplate(
    isNestedPage ? '../partials/footer.html' : 'partials/footer.html',
  );

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) renderWithTemplate(headerTemplate, headerElement);
  if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}
