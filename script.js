/* ============================================================
   MY_SHOP — script.js (100% WhatsApp Image Preview Fixed)
   ============================================================ */

/* ------------------------------------------------------------
   ⚙️ SETTINGS
   ------------------------------------------------------------ */
const WHATSAPP_NUMBER = "447572001813"; 
const ADMIN_PASSWORD = "12123434";      

/* ------------------------------------------------------------
   DEFAULT PRODUCTS (exactly 10)
   ------------------------------------------------------------ */
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: "4500 روپے",
    description: "اعلیٰ معیار کی وائرلیس ہیڈفونز، شاندار آواز اور 20 گھنٹے کی بیٹری کے ساتھ۔",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
  },
  {
    id: 2,
    title: "Smart Watch",
    price: "6800 روپے",
    description: "جدید سمارٹ واچ جو آپ کے قدم، دل کی دھڑکن اور نیند کو مانیٹر کرتی ہے۔",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
  },
  {
    id: 3,
    title: "Running Sneakers",
    price: "5200 روپے",
    description: "آرام دہ اور مضبوط جوگرز، روزانہ دوڑنے اور چلنے کے لیے بہترین۔",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
  },
  {
    id: 4,
    title: "Classic Sunglasses",
    price: "1500 روپے",
    description: "دھوپ سے مکمل حفاظت کے ساتھ سٹائلش سن گلاسز، UV400 پروٹیکشن۔",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
  },
  {
    id: 5,
    title: "Travel Backpack",
    price: "3800 روپے",
    description: "واٹر پروف بیگ، لیپ ٹاپ کمپارٹمنٹ کے ساتھ، سفر اور دفتر دونوں کے لیے۔",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
  },
  {
    id: 6,
    title: "Wireless Earbuds",
    price: "2900 روپے",
    description: "چھوٹے اور ہلکے ایئر بڈز، صاف آواز اور چارجنگ کیس کے ساتھ۔",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"
  },
  {
    id: 7,
    title: "Instant Camera",
    price: "9500 روپے",
    description: "فوری تصویر پرنٹ کرنے والا کیمرہ، یادگار لمحات کے لیے بہترین تحفہ۔",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80"
  },
  {
    id: 8,
    title: "Luxury Perfume",
    price: "2400 روپے",
    description: "دیر تک قائم رہنے والی دلکش خوشبو، ہر موقع کے لیے موزوں۔",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80"
  },
  {
    id: 9,
    title: "Leather Wallet",
    price: "1800 روپے",
    description: "اصلی چمڑے کا خوبصورت بٹوہ، کارڈز اور نقدی کے لیے کافی جگہ۔",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"
  },
  {
    id: 10,
    title: "Bluetooth Speaker",
    price: "3200 روپے",
    description: "طاقتور آواز والا پورٹیبل اسپیکر، گھر اور پکنک دونوں کے لیے بہترین۔",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"
  }
];

/* ------------------------------------------------------------
   STORAGE — load & save products in localStorage
   ------------------------------------------------------------ */
const STORAGE_KEY = "myshop_products";

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...DEFAULT_PRODUCTS];
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

let products = loadProducts();
let isAdminLoggedIn = false;

/* ------------------------------------------------------------
   WHATSAPP ORDER WITH AUTOMATIC LINK FORCING
   ------------------------------------------------------------ */
function buyOnWhatsApp(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let productImageUrl = product.image;
  if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) {
    productImageUrl = window.location.origin + "/" + product.image;
  }

  // نیا فارمیٹ: تصویر کے لنک کو سب سے پہلی لائن پر رکھنے اور ساتھ ٹیکسٹ جوڑنے سے پریویو فوراً اوپن ہوتا ہے
  const text = `${productImageUrl}\n\nسلام، میں آپ کی ویب سائٹ سے یہ آئٹم آرڈر کرنا چاہتا ہوں:\n\n*پروڈکٹ:* ${product.title}\n*قیمت:* ${product.price}`;
  
  const whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(whatsappUrl, '_blank');
}

/* ------------------------------------------------------------
   RENDER — homepage product grid
   ------------------------------------------------------------ */
const productsGrid = document.getElementById("productsGrid");
const emptyMessage = document.getElementById("emptyMessage");

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderProducts() {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }
  emptyMessage.classList.add("hidden");

  products.forEach(product => {
    let imgSrc = product.image;
    if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) {
      imgSrc = "./" + product.image;
    }

    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-2xl overflow-hidden border border-stone-200";

    card.innerHTML = `
      <img src="${escapeHTML(imgSrc)}" alt="${escapeHTML(product.title)}"
           class="product-img" loading="lazy"
           onerror="this.src='https://placehold.co/600x400/ecfdf5/047857?text=Image'" />
      <div class="p-4">
        <h3 class="font-display font-semibold text-lg">${escapeHTML(product.title)}</h3>
        <p class="urdu-text text-stone-600 text-sm mt-2 mb-3">${escapeHTML(product.description)}</p>
        <div class="flex items-center justify-between gap-2 mt-3">
          <span class="urdu-text font-semibold text-emerald-700">${escapeHTML(product.price)}</span>
          <button onclick="buyOnWhatsApp(${product.id})"
            class="whatsapp-btn text-white font-semibold text-sm rounded-full px-4 py-2 flex items-center gap-1.5">
            Buy via WhatsApp
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

/* ------------------------------------------------------------
   ADMIN — login modal
   ------------------------------------------------------------ */
const loginModal = document.getElementById("loginModal");
const adminDashboard = document.getElementById("adminDashboard");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const loginError = document.getElementById("loginError");

document.getElementById("adminLoginBtn").addEventListener("click", () => {
  if (isAdminLoggedIn) {
    openDashboard();
  } else {
    loginModal.classList.remove("hidden");
    adminPasswordInput.value = "";
    loginError.classList.add("hidden");
    adminPasswordInput.focus();
  }
});

document.getElementById("loginCancelBtn").addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

function attemptLogin() {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    loginModal.classList.add("hidden");
    openDashboard();
  } else {
    loginError.classList.remove("hidden");
    adminPasswordInput.value = "";
    adminPasswordInput.focus();
  }
}

document.getElementById("loginSubmitBtn").addEventListener("click", attemptLogin);
adminPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptLogin();
});

/* ------------------------------------------------------------
   ADMIN — dashboard (add / delete products)
   ------------------------------------------------------------ */
const adminProductsList = document.getElementById("adminProductsList");
const addError = document.getElementById("addError");

function openDashboard() {
  renderAdminList();
  adminDashboard.classList.remove("hidden");
}

document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  isAdminLoggedIn = false;
  adminDashboard.classList.add("hidden");
});

function renderAdminList() {
  adminProductsList.innerHTML = "";

  if (products.length === 0) {
    adminProductsList.innerHTML =
      '<p class="text-stone-400 text-sm">No products yet. Add one above.</p>';
    return;
  }

  products.forEach(product => {
    let imgSrc = product.image;
    if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) {
      imgSrc = "./" + product.image;
    }

    const row = document.createElement("div");
    row.className =
      "flex items-center gap-3 border border-stone-200 rounded-lg p-2 bg-white";
    row.innerHTML = `
      <img src="${escapeHTML(imgSrc)}" alt=""
           class="w-12 h-12 rounded-lg object-cover"
           onerror="this.src='https://placehold.co/100x100'" />
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm truncate">${escapeHTML(product.title)}</p>
        <p class="urdu-text text-emerald-700 text-xs">${escapeHTML(product.price)}</p>
      </div>
      <button onclick="deleteProduct(${product.id})"
        class="text-sm font-semibold text-red-600 px-3 py-1.5">
        Delete
      </button>
    `;
    adminProductsList.appendChild(row);
  });
}

function deleteProduct(productId) {
  products = products.filter(p => p.id !== productId);
  saveProducts();
  renderProducts();   
  renderAdminList();  
}

document.getElementById("addProductBtn").addEventListener("click", () => {
  const title = document.getElementById("newTitle").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const image = document.getElementById("newImage").value.trim();
  const description = document.getElementById("newDescription").value.trim();

  if (!title || !price || !image || !description) {
    addError.classList.remove("hidden");
    return;
  }
  addError.classList.add("hidden");

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  products.push({ id: newId, title, price, description, image });
  saveProducts();
  renderProducts();
  renderAdminList();

  document.getElementById("newTitle").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newImage").value = "";
  document.getElementById("newDescription").value = "";
});

renderProducts();
