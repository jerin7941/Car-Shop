// Data store tracking items arrays
let cart = [];
let wishlist = [];

const ownerWhatsappNumber = "919544817941";
const emailAddress = "doodhanx@gmail.com";

// Toggle Sidebar Component View Panels directly
function togglePanel(panelId) {
    const target = document.getElementById(panelId);
    if(target) {
        target.style.display = (target.style.display === 'none' || target.style.display === '') ? 'block' : 'none';
    }
}

// Add Item to Eshop Cart Engine
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    renderCart();
}

// Remove Item from Eshop Cart Engine
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
}

// Render Shopping Cart UI Displays
function renderCart() {
    const container = document.getElementById("cart-items-container");
    const totalSpan = document.getElementById("cart-total-price");
    const navCounter = document.getElementById("nav-cart-count");

    if (!container) return;
    container.innerHTML = "";
    let totalQuantity = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-message">Your cart is currently empty.</div>';
        if (totalSpan) totalSpan.innerText = "₹0";
        if (navCounter) navCounter.innerText = "0";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalQuantity += item.quantity;

        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                ${item.quantity} × ₹${item.price} = ₹${itemTotal}
            </div>
            <button class="btn-remove" onclick="removeFromCart('${item.name}')">Delete</button>
        `;
        container.appendChild(itemRow);
    });

    if (totalSpan) totalSpan.innerText = "₹" + total;
    if (navCounter) navCounter.innerText = totalQuantity;
}

/* Amazon Style Wishlist Engine Toggle Controllers */
function toggleWishlist(name, price) {
    const heartIcon = document.getElementById(`heart-${name.replace(/ /g, "-")}`);
    const index = wishlist.findIndex(item => item.name === name);

    if (index > -1) {
        wishlist.splice(index, 1);
        if (heartIcon) {
            heartIcon.className = "fa-regular fa-heart";
        }
    } else {
        wishlist.push({ name: name, price: price });
        if (heartIcon) {
            heartIcon.className = "fa-solid fa-heart";
        }
    }
    renderWishlist();
}

// Render Wishlist Panel Displays
function renderWishlist() {
    const container = document.getElementById("wishlist-items-container");
    const navCounter = document.getElementById("nav-wishlist-count");

    if (!container) return;
    container.innerHTML = "";

    if (navCounter) navCounter.innerText = wishlist.length;

    if (wishlist.length === 0) {
        container.innerHTML = '<div class="empty-message">Your wishlist is currently empty.</div>';
        return;
    }

    wishlist.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>₹${item.price}
            </div>
            <button class="btn-remove" onclick="toggleWishlist('${item.name}', ${item.price})">Remove</button>
        `;
        container.appendChild(row);
    });
}

// Buy Now trigger action buttons opens delivery form directly
function buyNowAction(name, price) {
    addToCart(name, price);
    openCheckoutModal();
}

// Modal Windows View Operations Controls
function openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if(modal) modal.style.display = "flex";
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if(modal) modal.style.display = "none";
}

// Create Extended Invoice Data Sets
function generateReceiptData() {
    const name = document.getElementById("buyer-name")?.value.trim() || "";
    const email = document.getElementById("buyer-email")?.value.trim() || "";
    const phone = document.getElementById("buyer-phone")?.value.trim() || "";
    const pincode = document.getElementById("buyer-pincode")?.value.trim() || "";
    const dist = document.getElementById("buyer-dist")?.value.trim() || "";
    const state = document.getElementById("buyer-state")?.value.trim() || "";
    const address = document.getElementById("buyer-address")?.value.trim() || "";

    if (cart.length === 0) {
        alert("Your cart is empty! Please add items first.");
        return null;
    }

    if (!name || !email || !phone || !pincode || !dist || !state || !address) {
        alert("Please completely fill all modern delivery credentials inputs.");
        return null;
    }

    const orderId = "BYC-" + Math.floor(100000 + Math.random() * 900000);
    let total = 0;
    let itemLines = "";

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemLines += `${item.name} (Qty:${item.quantity}) - ₹${subtotal}\n`;
    });

    return { name, email, phone: formatPhoneNumber(phone), pincode, dist, state, address, orderId, total, itemLines };
}

function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) cleaned = "91" + cleaned;
    return cleaned;
}

// Inject details to receipt panel framework blocks
function showReceipt(receipt) {
    const receiptPage = document.getElementById("receipt-page");
    if (!receiptPage) return;

    document.getElementById("receipt-name").innerText = receipt.name;
    document.getElementById("receipt-email").innerText = receipt.email;
    document.getElementById("receipt-phone").innerText = receipt.phone;
    document.getElementById("receipt-address").innerText = receipt.address;
    document.getElementById("receipt-dist").innerText = receipt.dist;
    document.getElementById("receipt-state").innerText = receipt.state;
    document.getElementById("receipt-pincode").innerText = receipt.pincode;
    document.getElementById("receipt-orderid").innerText = receipt.orderId;
    document.getElementById("receipt-total").innerText = "₹" + receipt.total;

    const table = document.getElementById("receipt-products");
    if (table) {
        table.innerHTML = "";
        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${item.name}</td><td class="txt-center">${item.quantity}</td><td class="txt-right">₹${item.price * item.quantity}</td>`;
            table.appendChild(row);
        });
    }
    receiptPage.style.display = "block";
}

// WhatsApp External API Formatter Router Call handlers
function checkoutWhatsApp() {
    const receipt = generateReceiptData();
    if (!receipt) return;

    showReceipt(receipt);

    let message =
`🧾 ORDER PURCHASE RECEIPT
Order ID: ${receipt.orderId}

Name: ${receipt.name}
Email: ${receipt.email}
Phone: ${receipt.phone}
Address: ${receipt.address}, ${receipt.dist}, ${receipt.state} - ${receipt.pincode}

Items Ordered:
${receipt.itemLines}
Grand Total: ₹${receipt.total}

Thank You For Shopping With Us!`;

    window.open(`https://wa.me/${ownerWhatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

// Email Standard Mailto Client Linkages Formatter handlers
function checkoutEmail() {
    const receipt = generateReceiptData();
    if (!receipt) return;

    showReceipt(receipt);

    const body = `Order ID: ${receipt.orderId}\n\nName: ${receipt.name}\nEmail: ${receipt.email}\nPhone: ${receipt.phone}\nAddress: ${receipt.address}, ${receipt.dist}, ${receipt.state} - ${receipt.pincode}\n\nItems Ordered:\n${receipt.itemLines}\nGrand Total: ₹${receipt.total}`;
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent('New Order - ' + receipt.orderId)}&body=${encodeURIComponent(body)}`;
}

// Added Premium HTML-to-PDF Conversion Feature Function
function downloadPDFInvoice() {
    // Select specific container area to eliminate print artifact leakage
    const element = document.getElementById('invoice-print-area');
    const orderId = document.getElementById('receipt-orderid').innerText || 'Order';
    
    if(!element) return;
    
    // Configure crisp digital parameters
    const opt = {
        margin:       15,
        filename:     `Invoice-${orderId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Execute standard asynchronous execution pipelines
    html2pdf().set(opt).from(element).save();
}