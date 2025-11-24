const API_URL = 'https://dummyjson.com/products'
let productChart = null
const addProductForm = document.getElementById('addProductForm')
const productsContainer = document.getElementById('products')

let products = JSON.parse(localStorage.getItem('products')) || []

// Används föt att visa produkter på sidan

function renderProducts() {
    productsContainer.innerHTML = ''

    // Filtrera kategorier och begränsa antal produkter
    const beautyProducts = products
        .filter((p) => p.category.toLowerCase() === 'beauty')
        .slice(0, 5)

    const furnitureProducts = products
        .filter((p) => p.category.toLowerCase() === 'furniture')
        .slice(0, 3)

    const finalProducts = [...beautyProducts, ...furnitureProducts]

    // Rendera produkterna
    finalProducts.forEach((product) => {
        const card = document.createElement('div')
        card.classList.add('product-card')

        card.innerHTML = `
            <h4>${product.title}</h4>
            <p><strong>Kategori:</strong> ${product.category}</p>
            <p>${product.description}</p>
            <p><strong>Pris:</strong> ${product.price} kr</p>
            <img src="${product.thumbnail || product.images?.[0]}" width="150">
            <button class="delete-btn" data-id="${product.id}">Ta bort</button>
            <button class="show-on-index-btn" data-id="${
                product.id
            }">Visa på startsidan</button>
        `

        productsContainer.appendChild(card)
    })
}

// Används för att visa diagram över produktkategorier

function renderChart(products) {
    const ctx = document.getElementById('productChart')

    // Radera befintlig graf innan ny skapas
    if (productChart !== null) {
        productChart.destroy()
    }

    const beautyProducts = products
        .filter((p) => p.category.toLowerCase() === 'beauty')
        .slice(0, 5)

    const furnitureProducts = products
        .filter((p) => p.category.toLowerCase() === 'furniture')
        .slice(0, 3)

    const categoryCounts = {
        beauty: beautyProducts.length,
        furniture: furnitureProducts.length
    }

    const labels = Object.keys(categoryCounts)
    const values = Object.values(categoryCounts)

    // Spara chart-instansen i variabeln
    productChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Antal produkter per kategori',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    })
}

// Hämtar produkter från API eller alternativt från localStorage om API-anropet misslyckas

async function loadProducts() {
    try {
        const response = await fetch(API_URL)
        const data = await response.json()

        products = data.products

        localStorage.setItem('products', JSON.stringify(products))
        renderProducts()
        renderChart(products)
    } catch (err) {
        console.log(
            'Kunde inte hämta från API, laddar från localStorage istället'
        )

        renderProducts()
        renderChart(products)
    }
}

// Ska kunna lägga till nya produkter via formuläret (Tillfälla problem)

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const newProduct = {
        title: document.getElementById('addTitle').value,
        category: document.getElementById('addCategory').value,
        description: document.getElementById('addDescription').value,
        price: parseFloat(document.getElementById('addPrice').value),
        image: document.getElementById('addImage').value
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })

        const savedProduct = await response.json()

        products.push(savedProduct)
        localStorage.setItem('products', JSON.stringify(products))

        renderProducts()
        addProductForm.reset()
    } catch (error) {
        console.error('POST error:', error)
    }
})

// Låter användaren ta bort produkter

productsContainer.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('delete-btn')) return

    const id = e.target.getAttribute('data-id')

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

        products = products.filter((p) => p.id != id)
        localStorage.setItem('products', JSON.stringify(products))

        renderProducts()
        renderChart(products)
    } catch (error) {
        console.error('DELETE error:', error)
    }
})

loadProducts()

productsContainer.addEventListener('click', (e) => {
    // ...redan befintlig kod för delete...

    // Visa på startsidan
    if (e.target.classList.contains('show-on-index-btn')) {
        const id = e.target.getAttribute('data-id')
        const product = products.find((p) => String(p.id) === String(id))
        if (product) {
            // Hämta nuvarande "featuredProducts" från localStorage eller skapa ny array
            const featured = JSON.parse(
                localStorage.getItem('featuredProducts') || '[]'
            )
            // Lägg till produkten om den inte redan finns
            if (!featured.some((p) => String(p.id) === String(product.id))) {
                featured.push(product)
                localStorage.setItem(
                    'featuredProducts',
                    JSON.stringify(featured)
                )
                alert('Produkten visas nu på startsidan!')
            } else {
                alert('Produkten visas redan på startsidan.')
            }
        }
    }
})
