import { getParam, setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData();

function addProductToCart(product) {
  const cart = JSON.parse(localStorage.getItem('so-cart') || '[]');
  cart.push(product);
  localStorage.setItem('so-cart', JSON.stringify(cart));
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

const addToCartButton = document.getElementById('addToCart');
if (addToCartButton) {
  addToCartButton.addEventListener('click', addToCartHandler);
}

async function loadProductDetail() {
  const productId = getParam('product');
  const productDetail = document.querySelector('#product-detail');

  if (productId && productDetail) {
    const product = await dataSource.findProductById(productId);
    const image = product.Images?.PrimaryLarge || product.Images?.PrimaryMedium;
    const price = product.FinalPrice ?? product.ListPrice ?? 0;
    productDetail.innerHTML = `
      <section class="product-detail">
        <h3>${product.Brand?.Name || 'Sleep Outside'}</h3>
        <h2 class="divider">${product.Name}</h2>
        <img class="divider" src="${image}" alt="${product.Name}" />
        <p class="product-card__price">$${price}</p>
        <p class="product__color">${product.Colors?.[0]?.ColorName || 'Standard color'}</p>
        <p class="product__description">${product.DescriptionHtmlSimple || product.Name}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
      </section>
    `;

    const generatedButton = document.getElementById('addToCart');
    generatedButton.addEventListener('click', addToCartHandler);
  }
}

loadProductDetail();
