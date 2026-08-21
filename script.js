document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();

    // Filtro de busca simples
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const titulo = card.querySelector('.product-title').textContent.toLowerCase();
                if (titulo.includes(termo)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Busca os produtos do PHP e renderiza os cards estilo Shopee
async function carregarProdutos() {
    try {
        const resposta = await fetch('api.php');
        const produtos = await resposta.json();
        
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        if (produtos.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Nenhum produto cadastrado ainda.</p>';
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
                    <button class="btn-buy" onclick="alert('Produto adicionado!')">Comprar</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
    }
}
