/* data & API*/

/* Lagring av API:t för senare användning */
const apiURL = "https://dummyjson.com/products";

/* Kategorier för filtrering */
const clothingCategories = [
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-dresses",
    "womens-shoes",
    "womens-watches",
    "tops"
];

/* här lägger vi allt som har med datan att göra. */

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
        const response = await fetch(`${apiURL}?limit=3000`);
        
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

// visar produkter i article# --> funktionen tar data och bygger html av den
function renderProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCat = categorySelect.value; // <-- hämta vald kategori

    // vi filtrerar på både kategori och sökterm
    const filtredproducts = products.filter(product => {

        // Regler för vad som ska visas 

        const matchCategory = !selectedCat || product.category === selectedCat;
        // ^ om ingen kategori vald ->, annars måste a


        const matchSearch = !searchTerm || product.title.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    productList.innerHTML = "";

    filtredproducts.forEach(product => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        card.innerHTML = `
        <img 
        src="${product.thumbnail}"
        alt="${product.title}"
        class="product-image">

        <h3>${product.title}</h3>
        <p>Kategori: ${product.category}</p>
        <p>Beskrivning: ${product.description}</p>
        <p>Pris: ${product.price} kr</p>
        `;

        productList.appendChild(card);
    });
}

categorySelect.addEventListener("change", renderProducts);

// varje gång användaren skriver -> rendera om
searchInput.addEventListener("input", renderProducts);
