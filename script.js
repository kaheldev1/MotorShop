document.addEventListener('DOMContentLoaded', () => {
    const contacts = [
        { name: "Franz Elpa" },
        { name: "Kristoffer Soriano" },
        { name: "Lyn Tila-on" },
        { name: "Dale Sercena" },
        { name: "Liezel Develuz" }
    ];

    const helpBtn = document.getElementById('helpBtn');
    const helpOverlay = document.getElementById('helpOverlay');
    const closeHelpBtn = helpOverlay ? helpOverlay.querySelector('.close-help') : null;
    const contactListDiv = document.getElementById('contact-list');

    function renderContacts() {
        if (!contactListDiv) return;
        contactListDiv.innerHTML = '';
        const ul = document.createElement('ul');
        ul.classList.add('contact-ul');
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = contact.name;
            ul.appendChild(li);
        });
        contactListDiv.appendChild(ul);
    }

    if (helpBtn && helpOverlay && closeHelpBtn) {
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderContacts();
            helpOverlay.style.display = 'flex';
        });

        closeHelpBtn.addEventListener('click', () => {
            helpOverlay.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                helpOverlay.style.display = 'none';
            }
        });
    }

    const cartBtn = document.querySelector('.cart-btn');
    const cartModal_element = document.querySelector('.cart-modal:not(#helpModal)');
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

    if (cartBtn && cartModal_element) {
        cartBtn.addEventListener('click', () => {
            cartModal_element.style.display = 'flex';
            paymentSection.style.display = cart.length > 0 ? 'block' : 'none';
        });
    }
    if (closeCart) {
        closeCart.addEventListener('click', () => cartModal_element.style.display = 'none');
    }

    const addCartButtons = document.querySelectorAll('.add-cart');

    addCartButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.card');
            if (!card) return;

            const productName = card.querySelector('h3')?.textContent || 'Unnamed';
            const priceText = card.querySelector('p')?.textContent.match(/[\d,.]+/)?.[0].replace(/,/g, '') || '0';
            const price = parseInt(priceText) || 0;

            cart.push({ product: productName, price });
            total += price;

            updateCart();
            showNotification();

            if (paymentSection) paymentSection.style.display = 'block';
        });
    });

    function updateCart() {
        if (!cartItemsContainer || !cartCount || !cartTotal) return;
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

    function showNotification() {
        if (!notification) return;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 2000);
    }

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (!phoneInputContainer || !phoneNumberInput) return;
            if (radio.value === 'GCash' || radio.value === 'PayMaya') {
                phoneInputContainer.style.display = 'block';
                phoneNumberInput.value = '';
                phoneNumberInput.focus();
            } else {
                phoneInputContainer.style.display = 'none';
            }
        });
    });

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="payment"]:checked');
            if (!selected) {
                alert('Please select a payment method.');
                return;
            }

            let paymentMethod = selected.value;
            let alertMessage = `Your payment using ${paymentMethod} was successful.`;

            if (paymentMethod === 'GCash' || paymentMethod === 'PayMaya') {
                const phoneNumber = phoneNumberInput.value.trim();
                if (phoneNumber === '' || phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
                    alert('Please enter a valid 11-digit mobile number for this payment method.');
                    return;
                }
                alertMessage = `Your payment using ${paymentMethod} to number ${phoneNumber} was successful.`;
            }

            alert(alertMessage);

            cart = [];
            total = 0;
            updateCart();
            if (phoneNumberInput) phoneNumberInput.value = '';
            if (phoneInputContainer) phoneInputContainer.style.display = 'none';
            paymentRadios.forEach(radio => radio.checked = false);
            if (paymentSection) paymentSection.style.display = 'none';
            if (cartModal_element) cartModal_element.style.display = 'none';
        });
    }
});
