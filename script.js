// =====================================
// Aira gaul ! - MAIN JAVASCRIPT
// =====================================

const products = [
  {
    id: 1,
    name: "Velvet Matte Lipstick",
    category: "Lipstick",
    price: 89000,
    oldPrice: 120000,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    tag: "BEST SELLER"
  },
  {
    id: 2,
    name: "Dreamy Glow Cushion",
    category: "Face",
    price: 125000,
    oldPrice: 165000,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600",
    tag: "POPULAR"
  },
  {
    id: 3,
    name: "Rosy Blush Palette",
    category: "Face",
    price: 79000,
    oldPrice: 99000,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
    tag: "NEW"
  },
  {
    id: 4,
    name: "Sweet Pink Lip Gloss",
    category: "Lipstick",
    price: 65000,
    oldPrice: 85000,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    tag: "TRENDING"
  },
  {
    id: 5,
    name: "Soft Glam Eyeshadow",
    category: "Eyes",
    price: 110000,
    oldPrice: 145000,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600",
    tag: "BEST SELLER"
  },
  {
    id: 6,
    name: "Daily Glow Serum",
    category: "Skincare",
    price: 95000,
    oldPrice: 125000,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    tag: "POPULAR"
  },
  {
    id: 7,
    name: "Blossom Beauty Palette",
    category: "Eyes",
    price: 135000,
    oldPrice: 175000,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    tag: "NEW"
  },
  {
    id: 8,
    name: "Hydrating Face Cream",
    category: "Skincare",
    price: 89000,
    oldPrice: 115000,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600",
    tag: "SPECIAL"
  }
];

// =====================================
// ELEMENTS
// =====================================

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

let activeFilter = "All";
let searchQuery = "";

let cart = JSON.parse(localStorage.getItem("pinkeCart")) || [];

// =====================================
// FORMAT RUPIAH
// =====================================

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

// =====================================
// DISPLAY PRODUCTS
// =====================================

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchCategory =
      activeFilter === "All" ||
      product.category === activeFilter;

    const matchSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;padding:50px;color:#927984">
        No products found ♡
      </p>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">

      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        <span class="product-tag">${product.tag}</span>

        <button
          class="favorite-btn"
          data-favorite="${product.id}"
          aria-label="Add to favorites"
        >
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>

        <h3>${product.name}</h3>

        <div class="product-price">
          ${formatRupiah(product.price)}
          <del>${formatRupiah(product.oldPrice)}</del>
        </div>

        <button class="add-btn" data-add="${product.id}">
          + Add to Bag ♡
        </button>
      </div>

    </article>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

// =====================================
// FILTER PRODUCTS
// =====================================

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

// CATEGORY SHORTCUTS

document.querySelectorAll(".category-card").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.category;
    searchQuery = "";

    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.filter === activeFilter
      );
    });

    renderProducts();

    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// =====================================
// SEARCH
// =====================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", event => {
  searchQuery = event.target.value;
  renderProducts();
});

document.getElementById("searchBtn").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });

  searchInput.focus();
});

// =====================================
// ADD TO CART
// =====================================

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");

  if (addButton) {
    const id = Number(addButton.dataset.add);
    addToCart(id);
  }

  if (favoriteButton) {
    favoriteButton.classList.toggle("liked");

    const icon = favoriteButton.querySelector("svg");

    if (icon) {
      icon.style.fill = favoriteButton.classList.contains("liked")
        ? "#d98bae"
        : "none";
    }

    showToast(
      favoriteButton.classList.contains("liked")
        ? "Added to your favorites ♡"
        : "Removed from favorites"
    );
  }
});

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast("Added to your bag ♡");
}

// =====================================
// SAVE CART
// =====================================

function saveCart() {
  localStorage.setItem("pinkeCart", JSON.stringify(cart));
}

// =====================================
// DISPLAY CART
// =====================================

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);

    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatRupiah(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your bag is waiting for something lovely ♡
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">

        <img src="${product.image}" alt="${product.name}">

        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p>${formatRupiah(product.price)}</p>

          <div class="quantity">
            <button data-decrease="${item.id}">−</button>

            <span>${item.quantity}</span>

            <button data-increase="${item.id}">+</button>

            <button class="remove-btn" data-remove="${item.id}">
              Remove
            </button>
          </div>
        </div>

      </div>
    `;
  }).join("");
}

// =====================================
// CART CONTROLS
// =====================================

cartItems.addEventListener("click", event => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (increase) {
    const id = Number(increase.dataset.increase);
    const item = cart.find(p => p.id === id);

    if (item) item.quantity++;
  }

  if (decrease) {
    const id = Number(decrease.dataset.decrease);
    const item = cart.find(p => p.id === id);

    if (item) {
      item.quantity--;

      if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
      }
    }
  }

  if (remove) {
    const id = Number(remove.dataset.remove);
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  renderCart();
});

// =====================================
// OPEN AND CLOSE CART
// =====================================

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// =====================================
// MOBILE MENU
// =====================================

const menuBtn = document.getElementById("menuBtn");
const navigation = document.getElementById("navigation");

menuBtn.addEventListener("click", () => {
  navigation.classList.toggle("show");
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("show");
  });
});

// =====================================
// TOAST NOTIFICATION
// =====================================

let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// =====================================
// CHECKOUT DEMO
// =====================================

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your shopping bag is empty ♡");
    return;
  }

  alert(
    "Thank you for shopping at PINKÉ BEAUTY! ♡\n\n" +
    "This is a demo checkout. To accept real orders, " +
    "connect a backend or an ordering service."
  );
});

// =====================================
// NEWSLETTER DEMO
// =====================================

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = event.target.querySelector("input").value;

  showToast("Thank you for subscribing ♡");

  event.target.reset();
});

// =====================================
// INITIALIZE
// =====================================

renderProducts();
renderCart();

if (window.lucide) {
  lucide.createIcons();
}

console.log("PINKÉ BEAUTY is ready ♡");
