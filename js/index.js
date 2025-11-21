/* data & API*/

/* Lagring av API:t för senare användning "vår leverantör" */
const apiURL = "https://dummyjson.com/products";

/* Kategorier för filtrering, "Vår klädesbutik" */
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
        // Gör ett anrop till API:t, (alla produkter och kategorier)
        const response = await fetch(`${apiURL}?limit=3000`);

        // Vi gör om svaret till JS-objekt
        const data = await response.json();

        // vi sparar alla produkter i en temporär variabel
        const allproducts = data.products;

        // filtrerar ner till våra klädkategorier, som finns listade inom clothingCategories
        products = allproducts.filter(product => 
            clothingCategories.includes(product.category)
        );

        // visuellet bevis i konsolen att hämtningen och filtrering funkar
        console.log("API-data (endast kläder):", products);

        // visa produkterna på sidan
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

        const matchCategory =
        selectedCat === "all-categorys" || // om “all categorys” är valt -> visa ALLA (men bara kläder, pga fetch-filter)
        !selectedCat ||   // om ingen kategori är vald alls (tom sträng) -> visa alla
         product.category === selectedCat;  // annars: visa bara de med exakt rätt kategori
        // ^IF-sats- likt villkordstyrd formatering, om ingen kategori vald ->, annars måste ****************


        const matchSearch = !searchTerm || product.title.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    // Pagination

    // Vi räknar ut hur många sidor vi har totalt
    // math.ceil(...) rundar upp så att t.ex 10 produkter med pageSize 4 ger 3 sidor (4+4+2)
    
    const totalPages = Math.max(1, Math.ceil(filtredproducts.length / pageSize));

    // om currentPage blivit större än totala antalet sidor (t.ex efter filter) 
    // så tvingar vi tillbaka den till sista sidan
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }   

    // vi räknar ut vilka index som ska visas på denna sida
    
    const startIndex = (currentPage - 1) * pageSize; // ex: sida 1 -> 0, sida 2 -> 4, sida 3 -> 8
    const endIndex = startIndex + pageSize;  // ex: sida 1 -> 0–3, sida 2 -> 4–7

    // plocka ut bara de produkter som hör till denna sida
    const pageItems = filtredproducts.slice(startIndex, endIndex);



    productList.innerHTML = "";

    pageItems.forEach(product => {
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

    // text så användaren ser vilken sida hen är på 
    pageInfo.textContent = `Sida ${currentPage} av ${totalPages}`;

    // styr om knapparna så dessa blir klickbara
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages ||filtredproducts.length === 0;

}


    // När användaren klickar på "Förgående"
    prevPageBtn.addEventListener("click", () => {
        // gå bakåt om vi inte är på sida 1
        if (currentPage > 1) {
            currentPage--; // gå en sida bakåt (korta formen --)
            renderProducts(); // rita om med nya currentPage
        }
    });

         // När användaren klickar på "Nästa"
        nextPageBtn.addEventListener("click", () => {
        // Vi låter renderProducts sköta gränsen vid sista sidan **********************
        currentPage++;  // gå en sida framåt
        renderProducts();  // gör om med nya currentPage
    });

        // när användaren ändrar kategori  -> börja om på sida 1
        categorySelect.addEventListener("change", () => {
            currentPage = 1; // reseta till första sidan
            renderProducts();   
        });

        // varje gång användaren skriver i sökfältet → börja om på sida 1
        searchInput.addEventListener("input", () => {
            currentPage = 1; // reseta till första sidan
            renderProducts();   
        });