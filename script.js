const products = [
  { id: 1, name: "Laptop Dell XPS", price: 25000000 },
  { id: 2, name: "Điện thoại iPhone 15", price: 22000000 },
  { id: 3, name: "Tai nghe Bluetooth", price: 1500000 },
  { id: 4, name: "Bàn phím Cơ RGB", price: 1200000 },
];

let cart = [];

const formatCurrency = (amount, currencySymbol = "₫") => {
  return `${amount.toLocaleString("vi-VN")} ${currencySymbol}`;
};

const calculateTotal = (...prices) => {
  return prices.reduce((acc, curr) => acc + curr, 0);
};

const createCartItem = (id, name, price, quantity = 1) => {
  return {
    id,
    name,
    price,
    quantity,
    getTotalPrice() {
      return this.price * this.quantity;
    },
  };
};

const renderProducts = () => {
  const productListEl = document.getElementById("product-list");

  productListEl.innerHTML = products
    .map((product) => {
      const { id, name, price } = product;
      return `
      <div class="product-card">
        <div>
          <h3>${name}</h3>
          <p class="price">${formatCurrency(price)}</p>
        </div>
        <button class="btn btn-add" onclick="addToCart(${id})">Thêm vào giỏ</button>
      </div>
    `;
    })
    .join("");
};

const renderCart = () => {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Giỏ hàng đang trống</p>";
    cartTotalEl.innerText = formatCurrency(0);
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      ({ id, name, price, quantity }) => `
    <div class="cart-item">
      <div>
        <strong>${name}</strong> <br>
        <small>${formatCurrency(price)} x ${quantity}</small>
      </div>
      <button class="btn btn-remove" onclick="removeFromCart(${id})">Xóa</button>
    </div>
  `,
    )
    .join("");

  const itemTotals = cart.map((item) => item.price * item.quantity);
  const total = calculateTotal(...itemTotals);

  cartTotalEl.innerText = formatCurrency(total);
};

const addToCart = (productId) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const { id, name, price } = product;
    cart.push(createCartItem(id, name, price));
  }

  renderCart();
};

const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
};

const placeOrderAPI = (cartData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cartData.length === 0) {
        reject("Giỏ hàng của bạn đang trống, không thể đặt hàng");
      } else {
        resolve({
          status: 200,
          message: "Đặt hàng thành công",
        });
      }
    }, 1500);
  });
};

const handleCheckout = () => {
  const messageEl = document.getElementById("checkout-message");
  messageEl.className = "message";
  messageEl.innerText = "Đang xử lý đơn hàng";

  placeOrderAPI(cart)
    .then((response) => {
      messageEl.className = "message success";
      messageEl.innerText = response.message;
      cart = [];
      renderCart();
    })
    .catch((error) => {
      messageEl.className = "message error";
      messageEl.innerText = error;
    });
};

document
  .getElementById("checkout-btn")
  .addEventListener("click", handleCheckout);

renderProducts();
renderCart();
