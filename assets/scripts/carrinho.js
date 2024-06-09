window.onload = function() {
    loadCartItems();
};

function loadCartItems() {
    var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    var total = 0;
    cartItems.forEach(item => {
        addItemToCartDOM(item.name, item.price);
        total += item.price;
    });
    updateTotalDOM(total);
    updateCheckoutButtonState();
}

function addItemToCartDOM(itemName, itemPrice) {
    var newItem = document.createElement("li");
    newItem.innerHTML = `${itemName} - R$ ${itemPrice.toFixed(2)} <button class="remove-item">Remover</button>`;
    document.getElementById("lista-carrinho").appendChild(newItem);

    // Adicionar evento de clique ao botão de remover
    newItem.querySelector(".remove-item").addEventListener("click", function() {
        removeFromCart(itemName, itemPrice, newItem);
    });
}

function updateTotalDOM(total) {
    document.getElementById("total-carrinho").textContent = "R$ " + total.toFixed(2);
}

function addToCart(itemName, itemPrice) {
    addItemToCartDOM(itemName, itemPrice);
    updateCartTotal(itemPrice);

    var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    cartItems.push({ name: itemName, price: itemPrice });
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

    updateCheckoutButtonState();
}

function removeFromCart(itemName, itemPrice, listItem) {
    // Remover o item do DOM
    listItem.remove();

    // Atualizar o total do carrinho
    updateCartTotal(-itemPrice);

    // Remover o item do sessionStorage
    var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter(item => item.name !== itemName || item.price !== itemPrice);
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

    updateCheckoutButtonState();
}

function updateCartTotal(itemPriceChange) {
    var cartTotalElement = document.getElementById("total-carrinho");
    var currentTotal = parseFloat(cartTotalElement.textContent.replace("R$ ", "")) || 0;
    var newTotal = currentTotal + itemPriceChange;
    cartTotalElement.textContent = "R$ " + newTotal.toFixed(2);
}

function updateCheckoutButtonState() {
    var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    var checkoutButton = document.getElementById("finalizar-pedido-btn");
    if (cartItems.length === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }
}

function checkout() {
    var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    if (cartItems.length === 0) {
        alert("O carrinho está vazio. Adicione itens ao carrinho antes de finalizar o pedido.");
        return;
    }
    document.getElementById("lista-carrinho").innerHTML = "";
    updateTotalDOM(0);
    sessionStorage.removeItem("cartItems");
    alert("Pedido realizado com sucesso!");
    updateCheckoutButtonState();
}


document.addEventListener('DOMContentLoaded', function() {
    let produtos = [];

    // Carregar produtos do arquivo JSON
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
            displayProducts('all');
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

    // Função para exibir produtos filtrados por categoria
    function displayProducts(category) {
        const menuItemsContainer = document.getElementById('menuItems');
        menuItemsContainer.innerHTML = '';

        const filteredProducts = category === 'all' ? produtos : produtos.filter(item => item.category === category);

        filteredProducts.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.innerHTML = `
                <img src="${item.img}" alt="${item.alt}">
                <h2>${item.nome}</h2>
                <p>${item.descricao}</p>
                <p id="preco">Preço: R$ ${item.preco.toFixed(2)}</p>
                <button onclick="addToCart('${item.nome}', ${item.preco})">Adicionar ao Carrinho</button>
            `;
            menuItemsContainer.appendChild(menuItem);
        });
    }

    // Adicionar evento para filtrar produtos quando uma categoria for clicada
    document.querySelectorAll('#categoriesMenu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.currentTarget.dataset.category;
            displayProducts(category);
        });
    });
});