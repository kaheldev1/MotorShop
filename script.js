// ===== Cart Functionality =====
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total');
const confirmPaymentBtn = document.querySelector('.confirm-payment');
const notification = document.getElementById('cart-notification');
const paymentSection = document.querySelector('.payment-methods');
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const phoneInputContainer = document.getElementById('phone-input-container');
const phoneNumberInput = document.getElementById('phone-number');

let cart = [];
let total = 0;

// Open/Close Cart
cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  paymentSection.style.display = cart.length > 0 ? 'block' : 'none';
});
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

// Add-to-Cart buttons
document.addEventListener('DOMContentLoaded', () => {
  const addCartButtons = document.querySelectorAll('.add-cart');

  addCartButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); // prevent link jump

      // Get the card container
      const card = btn.closest('.card');
      if (!card) return;

      const productName = card.querySelector('h3')?.textContent || 'Unnamed';
      const priceText = card.querySelector('p')?.textContent.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceText) || 0;

      // Add to cart
      cart.push({ product: productName, price });
      total += price;

      updateCart();
      showNotification();

      // Show payment section
      paymentSection.style.display = 'block';
    });
  });
});

// Update cart display
function updateCart() {
  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const p = document.createElement('p');
    const formattedPrice = item.price.toLocaleString('en-US');
    p.textContent = `${item.product} - ₱${formattedPrice}`;
    cartItemsContainer.appendChild(p);
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: ₱${total.toLocaleString('en-US')}`;
}

// Show add-to-cart notification
function showNotification() {
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

// Show/hide phone input for GCash/PayMaya
paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'GCash' || radio.value === 'PayMaya') {
      phoneInputContainer.style.display = 'block';
      phoneNumberInput.value = '';
      phoneNumberInput.focus();
    } else {
      phoneInputContainer.style.display = 'none';
    }
  });
});

// Confirm payment
confirmPaymentBtn.addEventListener('click', () => {
  const selected = document.querySelector('input[name="payment"]:checked');
  if (!selected) {
    alert('Please select a payment method! 🚫');
    return;
  }

  let paymentMethod = selected.value;
  let alertMessage = `Your payment using ${paymentMethod} was successful! ✅`;

  if (paymentMethod === 'GCash' || paymentMethod === 'PayMaya') {
    const phoneNumber = phoneNumberInput.value.trim();
    if (phoneNumber === '' || phoneNumber.length < 11) {
      alert('Please enter a valid 11-digit mobile number for this payment method. 📞');
      return;
    }
    alertMessage = `Your payment using ${paymentMethod} to number ${phoneNumber} was successful! ✅`;
  }

  alert(alertMessage);

  // Reset cart
  cart = [];
  total = 0;
  updateCart();
  phoneNumberInput.value = '';
  phoneInputContainer.style.display = 'none';
  paymentRadios.forEach(radio => radio.checked = false);
  paymentSection.style.display = 'none';
  cartModal.style.display = 'none';
});
