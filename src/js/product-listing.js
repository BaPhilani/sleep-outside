import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const titleElement = document.querySelector('.category-title');

if (titleElement) {
    const formattedCategory = category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const myList = new ProductList(category, dataSource, listElement);
myList.init();
