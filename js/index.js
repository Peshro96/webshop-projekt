/* 
    index.js
    Sköter produktlistan, hämtning från API, filtrering, sök, sidindelning
    och visning av utvalda produkter
*/

/* API & kategorier */

// Bas-URL till DummyJSON, används i alla fetch-anrop
const apiURL = 'https://dummyjson.com/products'

// Kategorier vi visar på sidan (kläddelen av API:t)
const clothingCategories = [
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-dresses',
    'womens-shoes',
    'womens-watches',
    'tops'
]

/* Global state */

// Globala variabler för produktdata, sidhantering och filtrering
let products = []
let myPosts = []
let currentPage = 1
let pageSize = 4
let selectedCategory = localStorage.getItem('selectedCategory') || ''

/* DOM-elements */

// Hämtar referenser till relevanta DOM-element för dynamisk uppdatering.
const productList = document.getElementById('products')
const searchInput = document.getElementById('search')
const categorySelect = document.getElementById('filter-category')
const sortSelect = document.getElementById('filter-price')
const prevPageBtn = document.getElementById('prevBtn')
const nextPageBtn = document.getElementById('nextBtn')
const pageInfo = document.getElementById('pageInfo')

/* Initiering */

// När sidan är redo: hämta produkterna så vi har något att jobba med
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts()
    renderFeaturedProducts()
})

/*
    Hämtar produkter från API:t och filtrerar ut klädkategorier
    Resultatet sparas i 'products' och visas på sidan
*/

// Hämtar produkter från API:t
async function fetchProducts() {
    try {
        // Hämtar alla produkter från API:t (rejäl limit, tanken i början var för att se alla kategorier osv.)
        const response = await fetch(`${apiURL}?limit=3000`)

        // Gör om svaret till ett JS-objekt
        const data = await response.json()

        // Temporär lista med alla produkter
        const allproducts = data.products

        // Plockar ut bara de produkter som matchar våra klädkategorier
        products = allproducts.filter((product) =>
            clothingCategories.includes(product.category)
        )

        // Snabb koll i konsolen när man debuggar
        console.log('API-data (endast kläder):', products)

        // Ritning av första vyn
        renderProducts()
    } catch (err) {
        // Om API:et skulle falla eller svara konstigt
        console.error('API-fel:', err)
    }
}

// Renderar ut produkterna på sidan (tar hänsyn till sök, kategori och sidindelning)
function renderProducts() {
    // Läser av sökfältet + vald kategori just nu
    const searchTerm = searchInput.value.toLowerCase()
    const selectedCat = categorySelect.value

    // Filtrerar listan: först kategori-IF-logik, sen sök-IF-logik
    const filtredproducts = products.filter((product) => {
        // IF-logik för kategori-regeln
        const matchCategory =
            selectedCat === 'all-categorys' ||  // if: "alla kategorier" --> visa allt
            !selectedCat ||  // if: ingen kategori vald --> visa allt
            product.category === selectedCat // if: exakt match --> visa just den kategorin

        // IF-logik för sök-regeln (titel mot söksträng)
        const matchSearch =
            !searchTerm || product.title.toLowerCase().includes(searchTerm)

        // Båda reglerna måste passera för att produkten ska komma med
        return matchCategory && matchSearch
    })

    // Räknar ut hur många sidor det blir utifrån filtrerat resultat
    const totalPages = Math.max(1, Math.ceil(filtredproducts.length / pageSize))

    // Om man t.ex. filtrerar ner så att currentPage inte finns längre --> hoppa till sista
    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    // Plockar fram vilka index som ska visas på just den här sidan
    const startIndex = (currentPage - 1) * pageSize // ex: sida 1 --> 0, sida 2 --> 4 osv.
    const endIndex = startIndex + pageSize  // ex: sida 1 --> 0–3, sida 2 --> 4–7

    // Skär ut bara de produkter som hör till aktuell sida
    const pageItems = filtredproducts.slice(startIndex, endIndex)

    // Töm listan innan vi ritar om
    productList.innerHTML = ''

    // Bygger upp ett produktkort per item
    pageItems.forEach((product) => {
        const card = document.createElement('article')
        card.classList.add('product-card')

        card.innerHTML = `
        <img
        src="${product.thumbnail}"
        alt="${product.title}"
        class="product-image">

        <h3>${product.title}</h3>
        <p>Kategori: ${product.category}</p>
        <p>Beskrivning: ${product.description}</p>
        <p>Pris: ${product.price} kr</p>
        `

        productList.appendChild(card)
    })

    // Enkel info om vilken sida användaren är på
    pageInfo.textContent = `Sida ${currentPage} av ${totalPages}`

    // Styr knapparnas state (disable när det inte går att gå vidare)
    prevPageBtn.disabled = currentPage === 1
    nextPageBtn.disabled =
        currentPage === totalPages || filtredproducts.length === 0
}

// När användaren klickar på "Föregående"
prevPageBtn.addEventListener('click', () => {
    // Gå bakåt om vi inte redan står på första
    if (currentPage > 1) {
        currentPage--  // kortform: minus en sida
        renderProducts()  // rita om med uppdaterad currentPage
    }
})

// När användaren klickar på "Nästa"
nextPageBtn.addEventListener('click', () => {
    // Här låter vi renderProducts hålla koll på om vi slagit i taket
    currentPage++  // hoppa fram en sida
    renderProducts()  // rita om listan
})

// När kategori ändras --> börja om från sida 1 och rendera om
categorySelect.addEventListener('change', () => {
    currentPage = 1
    renderProducts()
})

// När användaren skriver i sökfältet --> också tillbaka till sida 1
searchInput.addEventListener('input', () => {
    currentPage = 1
    renderProducts()
})

// Renderar featured-listan med "ta bort"-knapp per produkt
function renderFeaturedProducts() {
    const featured = JSON.parse(
        localStorage.getItem('featuredProducts') || '[]'
    )
    const featuredContainer = document.getElementById('featured-products')
    if (!featuredContainer) return

    featuredContainer.innerHTML = ''
    featured.forEach((product, i) => {
        const card = document.createElement('div')
        card.classList.add('product-card')
        card.innerHTML = `
            <h4>${product.title}</h4>
            <p><strong>Kategori:</strong> ${product.category}</p>
            <p>${product.description}</p>
            <p><strong>Pris:</strong> ${product.price} kr</p>
            <img src="${
                product.thumbnail || product.images?.[0] || product.image
            }" width="150">
            <button class="remove-featured-btn" data-index="${i}">Ta bort</button>
        `
        featuredContainer.appendChild(card)
    })
}

// Lyssnar på klick i featured-listan och tar bort vald produkt från localStorage
document
    .getElementById('featured-products')
    .addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-featured-btn')) {
            const index = e.target.getAttribute('data-index')
            let featured = JSON.parse(
                localStorage.getItem('featuredProducts') || '[]'
            )
            featured.splice(index, 1)
            localStorage.setItem('featuredProducts', JSON.stringify(featured))
            renderFeaturedProducts()
        }
    })