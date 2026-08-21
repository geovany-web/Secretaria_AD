document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();

    // Filtro de busca na vitrine
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

// Lê os produtos salvos no localStorage e gera a vitrine
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos_shoppee')) || [];
    const productGrid = document.getElementById('productGrid');
    
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (produtos.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Nenhum produto cadastrado ainda. Vá ao Painel Admin para cadastrar!</p>';
        return;
    }

    produtos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/200'">
            <div class="product-info">
                <h3 class="product-title">${prod.nome}</h3>
                <div class="product-price">R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</div>
                <button class="btn-buy" onclick="alert('Produto adicionado ao carrinho!')">Comprar</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}
