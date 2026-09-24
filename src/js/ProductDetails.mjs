export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        if (!this.product) {
            document.querySelector('#product-detail').innerHTML =
                '<p>Product not found.</p>';
            return;
        }

        this.renderProductDetails();

        const addToCartButton = document.getElementById('addToCart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
        }
    }

    addProductToCart() {
        const cart = JSON.parse(localStorage.getItem('so-cart') || '[]');
        cart.push(this.product);
        localStorage.setItem('so-cart', JSON.stringify(cart));
    }

    renderProductDetails() {
        const productDetail = document.querySelector('#product-detail');
        if (!productDetail) return;

        const image = this.product.Images?.PrimaryLarge || this.product.Images?.PrimaryMedium;
        const price = this.product.FinalPrice ?? this.product.ListPrice ?? 0;
        const description = this.product.DescriptionHtmlSimple || this.product.Name;

        productDetail.innerHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand?.Name || 'Sleep Outside'}</h3>
        <h2 class="divider">${this.product.Name}</h2>
        <img class="divider" src="${image}" alt="${this.product.Name}" />
        <p class="product-card__price">$${price}</p>
        <p class="product__color">${this.product.Colors?.[0]?.ColorName || 'Standard color'}</p>
        <p class="product__description">${description}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
    }
}
