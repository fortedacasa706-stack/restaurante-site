const dishes = [
    { id: 1, name: "Risoto de Camarão", description: "Arroz cremoso com camarões frescos e ervas.", price: 59.90 },
    { id: 2, name: "Bife Acebolado", description: "Bife suculento com molho de cebola caramelizada.", price: 42.50 },
    { id: 3, name: "Salada Mediterrânea", description: "Mix de folhas, queijo feta, tomate e azeitonas.", price: 28.00 },
    { id: 4, name: "Pizza Margherita", description: "Base crocante, molho de tomate, mussarela e manjericão.", price: 34.90 },
    { id: 5, name: "Lasanha de Frango", description: "Camadas de massa com recheio cremoso e gratinado.", price: 39.90 },
    { id: 6, name: "Brownie com Sorvete", description: "Sobremesa quente servida com sorvete e calda.", price: 19.50 }
];

const dishGrid = document.getElementById('dishGrid');
const reservationsList = document.getElementById('reservationsList');
const ordersList = document.getElementById('ordersList');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const reservationForm = document.getElementById('reservationForm');
const paymentModal = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');
const paymentTotalEl = document.getElementById('paymentTotal');
const paymentNameInput = document.getElementById('paymentName');
const paymentCardInput = document.getElementById('paymentCard');
const paymentExpiryInput = document.getElementById('paymentExpiry');
const paymentCvvInput = document.getElementById('paymentCvv');
const modalClose = document.getElementById('modalClose');

let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
let reservations = JSON.parse(localStorage.getItem('restaurantReservations')) || [];
let orders = JSON.parse(localStorage.getItem('restaurantOrders')) || [];
let pendingOrder = null;

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderDishes() {
    dishGrid.innerHTML = dishes.map(dish => `
        <article class="dish-card">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
            <div class="price-tag">${formatCurrency(dish.price)}</div>
            <button type="button" onclick="addToCart(${dish.id})">Adicionar ao carrinho</button>
        </article>
    `).join('');
}

function saveState() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    localStorage.setItem('restaurantReservations', JSON.stringify(reservations));
    localStorage.setItem('restaurantOrders', JSON.stringify(orders));
}

function renderReservations() {
    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p class="empty-state">Nenhuma reserva ainda.</p>';
        return;
    }
    reservationsList.innerHTML = reservations.map(item => `
        <div class="list-item">
            <strong>${item.name} - ${item.date} às ${item.time}</strong>
            <span>${item.guests} convidados • ${item.email}</span>
            <p>${item.notes || 'Sem observações.'}</p>
        </div>
    `).join('');
}

function renderOrders() {
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-state">Nenhuma encomenda registrada.</p>';
        return;
    }
    ordersList.innerHTML = orders.map(order => `
        <div class="list-item">
            <strong>Pedido #${order.id} - ${order.date}</strong>
            <span>${order.items.length} item(s) • Total ${formatCurrency(order.total)}</span>
            <p>${order.note || 'Nenhuma observação adicionada.'}</p>
        </div>
    `).join('');
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-state">Seu carrinho está vazio. Adicione pratos do menu.</p>';
        cartTotalEl.textContent = formatCurrency(0);
        checkoutButton.disabled = true;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <span>${item.quantity} x ${formatCurrency(item.price)}</span>
            </div>
            <button type="button" onclick="removeFromCart(${item.id})">Remover</button>
        </div>
    `).join('');
    cartTotalEl.textContent = formatCurrency(total);
    checkoutButton.disabled = false;
}

function addToCart(dishId) {
    const dish = dishes.find(item => item.id === dishId);
    if (!dish) return;

    const existing = cart.find(item => item.id === dishId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...dish, quantity: 1 });
    }
    saveState();
    renderCart();
}

function removeFromCart(dishId) {
    cart = cart.filter(item => item.id !== dishId);
    saveState();
    renderCart();
}

function openPaymentModal() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    pendingOrder = { items: [...cart], total };
    paymentTotalEl.textContent = formatCurrency(total);
    paymentForm.reset();
    paymentModal.classList.add('visible');
}

function closePaymentModal() {
    paymentModal.classList.remove('visible');
    pendingOrder = null;
}

function completePayment(event) {
    event.preventDefault();

    if (!pendingOrder) return;

    const name = paymentNameInput.value.trim();
    const cardNumber = paymentCardInput.value.replace(/\s+/g, '');
    const expiry = paymentExpiryInput.value.trim();
    const cvv = paymentCvvInput.value.trim();

    if (!name || cardNumber.length < 14 || expiry.length !== 5 || cvv.length < 3) {
        alert('Por favor, verifique os dados do pagamento.');
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
        items: [...pendingOrder.items],
        total: pendingOrder.total,
        note: `Pagamento aprovado para ${name}`
    };

    orders.unshift(order);
    cart = [];
    saveState();
    renderCart();
    renderOrders();
    closePaymentModal();
    alert('Pagamento aprovado! Sua encomenda foi concluída.');
}

reservationForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;
    const notes = document.getElementById('resNotes').value.trim();

    reservations.unshift({
        id: Date.now(),
        name,
        email,
        date,
        time,
        guests,
        notes
    });

    saveState();
    renderReservations();
    reservationForm.reset();
    alert('Reserva efetuada com sucesso!');
});

checkoutButton.addEventListener('click', openPaymentModal);
modalClose.addEventListener('click', closePaymentModal);
paymentModal.addEventListener('click', event => {
    if (event.target === paymentModal) closePaymentModal();
});
paymentForm.addEventListener('submit', completePayment);

paymentCardInput.addEventListener('input', () => {
    let value = paymentCardInput.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    paymentCardInput.value = value;
});

paymentExpiryInput.addEventListener('input', () => {
    let value = paymentExpiryInput.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = `${value.slice(0,2)}/${value.slice(2,4)}`;
    }
    paymentExpiryInput.value = value;
});

window.addEventListener('load', () => {
    renderDishes();
    renderCart();
    renderReservations();
    renderOrders();
});
