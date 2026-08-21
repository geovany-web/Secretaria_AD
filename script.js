document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarContadorCarrinho();

    // Eventos do Modal do Carrinho
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartModal = document.getElementById('cartModal');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            abrirCarrinho();
            cartModal.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    // Busca rápida
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const titulo = card.querySelector('.product-title').textContent.toLowerCase();
                card.style.display = titulo.includes(termo) ? 'flex' : 'none';
            });
        });
    }
});

function obterProdutos() {
    return JSON.parse(localStorage.getItem('produtos_shoppee')) || [];
}

function carregarProdutos(categoriaFiltro = 'Todas') {
    const produtos = obterProdutos();
    const productGrid = document.getElementById('productGrid');
    
    if (!productGrid) return;
    productGrid.innerHTML = '';

    const listaFiltrada = categoriaFiltro === 'Todas' 
        ? produtos 
        : produtos.filter(p => p.categoria === categoriaFiltro);

    if (listaFiltrada.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    listaFiltrada.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="badge-frete">Frete Grátis</div>
            <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/200'">
            <div class="product-info">
                <span class="product-cat">${prod.categoria}</span>
                <h3 class="product-title">${prod.nome}</h3>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star-half-stroke"></i>
                    <span>(4.8)</span>
                </div>
                <div class="product-price">R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</div>
                <button class="btn-buy" onclick="adicionarAoCarrinho('${prod.id}')">
                    <i class="fa-solid fa-cart-plus"></i> Adicionar
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function filtrarCategoria(categoria) {
    carregarProdutos(categoria);
}

function adicionarAoCarrinho(idProduto) {
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === idProduto);

    if (!produto) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho_shoppee')) || [];
    carrinho.push(produto);
    
    localStorage.setItem('carrinho_shoppee', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_shoppee')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = carrinho.length;
    }
}

function abrirCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_shoppee')) || [];
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    
    container.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Seu carrinho está vazio.</p>';
        totalEl.textContent = 'R$ 0,00';
        return;
    }

    carrinho.forEach((prod, index) => {
        total += parseFloat(prod.preco);
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}">
            <div class="cart-item-details">
                <h4>${prod.nome}</h4>
                <p>R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="btn-remove" onclick="removerDoCarrinho(${index})"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(item);
    });

    totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_shoppee')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho_shoppee', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    abrirCarrinho();
}

function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_shoppee')) || [];
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let texto = 'Olá! Gostaria de fazer o pedido dos seguintes produtos:\n\n';
    let total = 0;

    carrinho.forEach((p, i) => {
        texto += `${i + 1}. ${p.nome} - R$ ${parseFloat(p.preco).toFixed(2)}\n`;
        total += parseFloat(p.preco);
    });

    texto += `\n*Total:* R$ ${total.toFixed(2)}`;
    
    // Altere para seu número do WhatsApp (formato: 55 + DDD + número)
    const numeroWhats = '5531999999999';
    window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`, '_blank');
}
