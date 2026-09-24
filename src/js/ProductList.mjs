import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    const productName = product.Name || product.NameWithoutBrand;
    const brandName = product.Brand?.Name || 'Sleep Outside';
    const imageUrl =
        product.Images?.PrimaryMedium ||
        product.Images?.PrimarySmall ||
        product.Images?.PrimaryLarge ||
        '';
    const price = product.FinalPrice ?? product.ListPrice ?? 0;

    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${imageUrl}" alt="${productName}" />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${productName}</h2>
        <p class="product-card__price">$${price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
    }
}
