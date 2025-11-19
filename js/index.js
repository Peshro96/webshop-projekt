/* data & API*/

/* Lagring av API:t för senare användning */
const apiURL = "https://dummyjson.com/products";

/* här kägger vi allt som har med datan att göra. */

let products = [];
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

const productList = document.getElementById('products');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('filter-category');
const sortSelect = document.getElementById('filter-price');
const prevPageBtn = document.getElementById('prevBtn');
const nextPageBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
/* const productForm = document.getElementById('productForm');
const myPostsList = document.getElementById('myPosts');
const categoryChart = document.getElementById('categoryChart'); */


console.log(productList);
console.log(searchInput);
console.log(categorySelect);
console.log(sortSelect);
console.log(prevPageBtn);
console.log(nextPageBtn);
console.log(pageInfo);

// när HTML är färdigladdad --> hämta produkterna
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});


/* När HTML strukturen är laddad i webbläsaren, 
körs denna funktion inuti (produkter laddas in via fetch) */

// Hämtar produkter från API:t
async function fetchProducts() {
    try {
        // Gör ett anrop till API:t
        const response = await fetch(`${apiURL}?limit=30`);
        
        // omvandlar svaret till JSON-data
        const data = await response.json();

        // sparar produkterna i vår globala array
        products = data.products;

        // visuellet bevis i konsolen att hämtningen funkar
        console.log("API-data:", products);

        // renderar produkterna på sidan
        renderProducts(); 

    } catch (err) {
        // ifall api ej fungerar, hör ihop med 'try funktionen'
        console.error("API-fel:", err);
    }
    
}

// visar produkter i article id="products"
function renderProducts() {
    
    //tömmer det som redan finns i listan så att inga dubletter skapas
    productList.innerHTML = "";

    // loopar igenom alla produkter i vår array
    products.forEach(product => {
        // skapar ett nytt elemen
        const card = document.createElement("div");
        card.classList.add("product-card");

        // fyller kortet med info (#)
        card.innerHTML =`
        <h3>${product.title}</h3>
        <p>Kategori: ${product.category}</p>
        <p>Beskrivning: ${product.description}</p>
        <p>Pris: ${product.price} kr</p>
        `;

        // lägger in kortet i vår <article id="products">
        productList.appendChild(card);
    });
}





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