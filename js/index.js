/* data & API*/

/* Lagring av API:t för senare användning */
const clothesAPIURL = "https://dummyjson.com/products";

/* här kägger vi allt som har med datan att göra. */

let product = [];
let myPosts = [];
let currentPage = 1;
let pageSize = 4;
let selectedCategory = localStorage.getItem('selectedCategory') || '';


/* debugging av produktlista -- validerad 
async function fetchProducts() {
    const res = await fetch(clothesAPIURL);
    const data = await res.json();
    console.log('produkter från api:', data.products);
    product = data.products;
}

fetchProducts();

 */

/* DOM elements */

const productList = document.getElementById('products')
const searchInput = document.getElementById('search')
const categorySelect = document.getElementById('filter-category')
const sortSelect = document.getElementById('filter-price')
const prevPageBtn = document.getElementById('prevBtn')
const nextPageBtn = document.getElementById('nextBtn')
const presentPage = document.getElementById('pageInfo')
/* const productForm = document.getElementById('')
const changeChart = document.getElementById('') */


console.log(productList);
console.log(searchInput);
console.log(categorySelect);
console.log(sortSelect);
console.log(prevPageBtn);
console.log(nextPageBtn);
console.log(pageInfo);





/* globala variabler
saker som resten av index.js behövr komma åt t.ex :
products, filtredproducts, API-URL osv.

fetchProducts()
hämta produkter från dummyjson
spara dem i min product-array
returnera datan så resten av koden kan använda den

egna block för att datan ska hållas separat.
inte blandas med rendering eller events
renare flöde, enklare att förstå allt visuellt senare.

*/


/* rendering */

/* events och init */