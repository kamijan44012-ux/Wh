/* ============================================================
   MY_SHOP — script.js (100% Automatic WhatsApp Image Preview)
   ============================================================ */

/* ------------------------------------------------------------
   ⚙️ SETTINGS
   ------------------------------------------------------------ */
const WHATSAPP_NUMBER = "447572001813"; // پلس (+) کا نشان مستقل ختم کر دیا گیا ہے
const ADMIN_PASSWORD = "12123434";      

/* ------------------------------------------------------------
   DEFAULT PRODUCTS
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
  }
];

const STORAGE_KEY = "myshop_products";

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { return [...DEFAULT_PRODUCTS]; }
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
   AUTOMATIC WHATSAPP IMAGE PREVIEW SYSTEM
   ------------------------------------------------------------ */
function buyOnWhatsApp(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let finalImageUrl = product.image;
  // اگر آپ ایڈمن پینل میں صرف تصویر کا نام لکھیں گے تو یہ اسے پورا لنک بنا دے گا
  if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) {
    finalImageUrl = window.location.origin + "/" + product.image;
  }

  // واٹس ایپ کے نئے قانون کے مطابق لنک سب سے آخر میں ہو تو واٹس ایپ خود بخود تصویر کا ڈبہ لوڈ کرتا ہے
  const message =
    "سلام، میں آپ کی ویب سائٹ سے یہ آئٹم آرڈر کرنا چاہتا ہوں:\n\n" +
    "*پروڈکٹ:* " + product.title + "\n" +
    "*قیمت:* " + product.price + "\n\n" +
    "🖼️ پروڈکٹ لنک: " + finalImageUrl;

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}

/* ------------------------------------------------------------
   RENDER PRODUCTS
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
      <img src="${escapeHTML(imgSrc)}" alt="${escapeHTML(product.title)}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/600x400'" />
      <div class="p-4">
        <h3 class="font-display font-semibold text-lg">${escapeHTML(product.title)}</h3>
        <p class="urdu-text text-stone-600 text-sm mt-2 mb-3">${escapeHTML(product.description)}</p>
        <div class="flex items-center justify-between gap-2 mt-3">
          <span class="urdu-text font-semibold text-emerald-700">${escapeHTML(product.price)}</span>
          <button onclick="buyOnWhatsApp(${product.id})" class="whatsapp-btn text-white font-semibold text-sm rounded-full px-4 py-2 flex items-center gap-1.5">
            Buy via WhatsApp
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// ADMIN PANEL LOGIC
const loginModal = document.getElementById("loginModal");
const adminDashboard = document.getElementById("adminDashboard");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const loginError = document.getElementById("loginError");

document.getElementById("adminLoginBtn").addEventListener("click", () => {
  if (isAdminLoggedIn) { openDashboard(); } else { loginModal.classList.remove("hidden"); adminPasswordInput.value = ""; loginError.classList.add("hidden"); adminPasswordInput.focus(); }
});

document.getElementById("loginCancelBtn").addEventListener("click", () => { loginModal.classList.add("hidden"); });

function attemptLogin() {
  if (adminPasswordInput.value === ADMIN_PASSWORD) { isAdminLoggedIn = true; loginModal.classList.add("hidden"); openDashboard(); } else { loginError.classList.remove("hidden"); adminPasswordInput.value = ""; adminPasswordInput.focus(); }
}

document.getElementById("loginSubmitBtn").addEventListener("click", attemptLogin);
adminPasswordInput.addEventListener("keydown", (e) => { if (e.key === "Enter") attemptLogin(); });

const adminProductsList = document.getElementById("adminProductsList");
const addError = document.getElementById("addError");

function openDashboard() { renderAdminList(); adminDashboard.classList.remove("hidden"); }
document.getElementById("adminLogoutBtn").addEventListener("click", () => { isAdminLoggedIn = false; adminDashboard.classList.add("hidden"); });

function renderAdminList() {
  adminProductsList.innerHTML = "";
  if (products.length === 0) { adminProductsList.innerHTML = '<p class="text-stone-400 text-sm">No products yet.</p>'; return; }

  products.forEach(product => {
    let imgSrc = product.image;
    if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) { imgSrc = "./" + product.image; }
    const row = document.createElement("div");
    row.className = "flex items-center gap-3 border border-stone-200 rounded-lg p-2 bg-white";
    row.innerHTML = `
      <img src="${escapeHTML(imgSrc)}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='https://placehold.co/100x100'" />
      <div class="flex-1 min-w-0"><p class="font-semibold text-sm truncate">${escapeHTML(product.title)}</p></div>
      <button onclick="deleteProduct(${product.id})" class="text-sm font-semibold text-red-600 px-3 py-1.5">Delete</button>
    `;
    adminProductsList.appendChild(row);
  });
}

function deleteProduct(productId) { products = products.filter(p => p.id !== productId); saveProducts(); renderProducts(); renderAdminList(); }

document.getElementById("addProductBtn").addEventListener("click", () => {
  const title = document.getElementById("newTitle").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const image = document.getElementById("newImage").value.trim();
  const description = document.getElementById("newDescription").value.trim();

  if (!title || !price || !image || !description) { addError.classList.remove("hidden"); return; }
  addError.classList.add("hidden");

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  products.push({ id: newId, title, price, description, image });
  saveProducts(); renderProducts(); renderAdminList();

  document.getElementById("newTitle").value = ""; document.getElementById("newPrice").value = ""; document.getElementById("newImage").value = ""; document.getElementById("newDescription").value = "";
});

renderProducts();
