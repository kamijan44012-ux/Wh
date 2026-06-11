/* ============================================================
   MY_SHOP — script.js
   ============================================================ */

/* ------------------------------------------------------------
   ⚙️ SETTINGS — CHANGE THESE TWO VALUES
   ------------------------------------------------------------
   WHATSAPP_NUMBER:
   - International format, NO "+" sign, NO spaces, NO dashes.
   - Pakistan example: 0300-1234567  →  "923001234567"
   - UAE example:      050-1234567   →  "971501234567"
   ------------------------------------------------------------ */
const WHATSAPP_NUMBER = "923001234567"; // ← اپنا واٹس ایپ نمبر یہاں لکھیں
const ADMIN_PASSWORD = "admin123";      // ← ایڈمن پاس ورڈ یہاں تبدیل کریں

/* ------------------------------------------------------------
   DEFAULT PRODUCTS (exactly 10)
   These load only on the FIRST visit. After that, products are
   read from localStorage so admin changes persist permanently.
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
      // Corrupted data → reset to defaults
      return [...DEFAULT_PRODUCTS];
    }
  }
  // First visit → seed with default products
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

let products = loadProducts();
let isAdminLoggedIn = false;

/* ------------------------------------------------------------
   WHATSAPP ORDER
   Opens WhatsApp (app on mobile, WhatsApp Web on desktop)
   with a pre-formatted Urdu order message.
   ------------------------------------------------------------ */
function buyOnWhatsApp(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const message =
    "سلام، میں آپ کی ویب سائٹ سے یہ آئٹم آرڈر کرنا چاہتا ہوں:\n\n" +
    "*پروڈکٹ:* " + product.title + "\n" +
    "*قیمت:* " + product.price;

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
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
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-2xl overflow-hidden border border-stone-200";

    card.innerHTML = `
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}"
           class="product-img" loading="lazy"
           onerror="this.src='https://placehold.co/600x400/ecfdf5/047857?text=Image'" />
      <div class="p-4">
        <h3 class="font-display font-semibold text-lg">${escapeHTML(product.title)}</h3>
        <p class="urdu-text text-stone-600 text-sm mt-2 mb-3">${escapeHTML(product.description)}</p>
        <div class="flex items-center justify-between gap-2 mt-3">
          <span class="urdu-text font-semibold text-emerald-700">${escapeHTML(product.price)}</span>
          <button onclick="buyOnWhatsApp(${product.id})"
            class="whatsapp-btn text-white font-semibold text-sm rounded-full px-4 py-2 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
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
    const row = document.createElement("div");
    row.className =
      "flex items-center gap-3 border border-stone-200 rounded-lg p-2 bg-white";
    row.innerHTML = `
      <img src="${escapeHTML(product.image)}" alt=""
           class="w-12 h-12 rounded-lg object-cover"
           onerror="this.src='https://placehold.co/100x100/ecfdf5/047857?text=%20'" />
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm truncate">${escapeHTML(product.title)}</p>
        <p class="urdu-text text-emerald-700 text-xs">${escapeHTML(product.price)}</p>
      </div>
      <button onclick="deleteProduct(${product.id})"
        class="text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 transition-colors">
        Delete
      </button>
    `;
    adminProductsList.appendChild(row);
  });
}

function deleteProduct(productId) {
  products = products.filter(p => p.id !== productId);
  saveProducts();
  renderProducts();   // homepage updates instantly
  renderAdminList();  // dashboard list updates instantly
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

  // Generate a unique id (1 higher than the current maximum)
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  products.push({ id: newId, title, price, description, image });
  saveProducts();
  renderProducts();
  renderAdminList();

  // Clear the form
  document.getElementById("newTitle").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newImage").value = "";
  document.getElementById("newDescription").value = "";
});

/* ------------------------------------------------------------
   INITIAL RENDER
   ------------------------------------------------------------ */
renderProducts();
