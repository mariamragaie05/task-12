function fetchProducts() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://dummyjson.com/products?limit=10", false);
    request.send();
    if (request.status === 200) {
        var response = JSON.parse(request.responseText);
        return response.products;
    }
    else {
        console.error("Failed to fetch products:", request.status, request.statusText);
        return [];
    }
}
function displayProducts(products) {
    var productContainer = document.getElementById("product-container");
    products.forEach(function (product) {
        var productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = "\n          <img src=\"".concat(product.thumbnail, "\" alt=\"").concat(product.title, "\" />\n          <h3>").concat(product.title, "</h3>\n          <p>").concat(product.description, "</p>\n          <p>Price: $").concat(product.price, "</p>\n          <button onclick=\"addToCart(").concat(product.id, ")\">Add to Cart</button>\n          <button onclick=\"viewProductDetails(").concat(product.id, ")\">View Details</button>\n        ");
        productContainer.appendChild(productDiv);
    });
}
function viewProductDetails(productId) {
    var products = fetchProducts();
    var product = products.find(function (p) { return p.id === productId; });
    if (!product)
        return;
    var productDetailContainer = document.createElement("div");
    productDetailContainer.className = "product-details";
    productDetailContainer.innerHTML = "\n      <h2>".concat(product.title, "</h2>\n      <img src=\"").concat(product.thumbnail, "\" alt=\"").concat(product.title, "\" />\n      <p>").concat(product.description, "</p>\n      <p>Price: $").concat(product.price, "</p>\n      <button onclick=\"addToCart(").concat(product.id, ")\">Add to Cart</button>\n      <button onclick=\"closeProductDetails()\">Close</button>\n    ");
    document.body.prepend(productDetailContainer);
}
function closeProductDetails() {
    var productDetailContainer = document.querySelector(".product-details");
    if (productDetailContainer) {
        document.body.removeChild(productDetailContainer);
    }
}
function addToCart(productId) {
    var products = fetchProducts();
    var product = products.find(function (p) { return p.id === productId; });
    if (!product)
        return;
    var cart = getCart();
    var cartItem = cart.find(function (item) { return item.product.id === productId; });
    if (cartItem) {
        cartItem.quantity++;
    }
    else {
        cart.push({ product: product, quantity: 1 });
    }
    saveCart(cart);
    alert("Product ".concat(product.title, " added to cart!"));
    displayCart();
}
function displayCart() {
    var cartContainer = document.getElementById("cart-container");
    if (!cartContainer)
        return;
    var cart = getCart();
    cartContainer.innerHTML = "";
    cart.forEach(function (item) {
        var cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = "\n        <p>".concat(item.product.title, " - Quantity: ").concat(item.quantity, "</p>\n        <button onclick=\"increaseQuantity(").concat(item.product.id, ")\">+</button>\n        <button onclick=\"decreaseQuantity(").concat(item.product.id, ")\">-</button>\n        <button onclick=\"removeFromCart(").concat(item.product.id, ")\">Remove</button>\n      ");
        cartContainer.appendChild(cartItemDiv);
    });
}
function increaseQuantity(productId) {
    var cart = getCart();
    var cartItem = cart.find(function (item) { return item.product.id === productId; });
    if (cartItem) {
        cartItem.quantity++;
        saveCart(cart);
        displayCart();
    }
}
function decreaseQuantity(productId) {
    var cart = getCart();
    var cartItem = cart.find(function (item) { return item.product.id === productId; });
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
    }
    else if (cartItem) {
        cart = cart.filter(function (item) { return item.product.id !== productId; });
    }
    saveCart(cart);
    displayCart();
}
function removeFromCart(productId) {
    var cart = getCart();
    cart = cart.filter(function (item) { return item.product.id !== productId; });
    saveCart(cart);
    displayCart();
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
function getCart() {
    var cartJSON = localStorage.getItem("cart");
    return cartJSON ? JSON.parse(cartJSON) : [];
}
function init() {
    var products = fetchProducts();
    displayProducts(products);
    displayCart();
}
onload = init;
document.body.insertAdjacentHTML("afterbegin", "\n    <div>\n      <input type=\"text\" id=\"search-input\" placeholder=\"Search...\" />\n      <select id=\"type-filter\">\n        <option value=\"\">All Types</option>\n        <option value=\"makeup\">Make Up</option>\n        <option value=\"perfumes\">Perfumes</option>\n      </select>\n      <select id=\"price-sort\">\n        <option value=\"asc\">Price: Low to High</option>\n        <option value=\"desc\">Price: High to Low</option>\n      </select>\n    </div>\n    <div id=\"cart-container\"></div>\n  ");
