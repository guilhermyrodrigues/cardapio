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
}

function addItemToCartDOM(itemName, itemPrice) {
    var newItem = document.createElement("li");
    newItem.textContent = itemName + " - R$ " + itemPrice.toFixed(2);
    document.getElementById("lista-carrinho").appendChild(newItem);
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
}

function updateCartTotal(itemPrice) {
    var cartTotalElement = document.getElementById("total-carrinho");
    var currentTotal = parseFloat(cartTotalElement.textContent.replace("R$ ", "")) || 0;
    var newTotal = currentTotal + itemPrice;
    cartTotalElement.textContent = "R$ " + newTotal.toFixed(2);
}

function checkout() {
    document.getElementById("lista-carrinho").innerHTML = "";
    updateTotalDOM(0);
    sessionStorage.removeItem("cartItems");
    alert("Pedido realizado com sucesso!");
}