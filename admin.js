document.addEventListener('DOMContentLoaded', () => {
    carregarTabelaAdmin();

    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', salvarProduto);
    }

    const btnCancel = document.getElementById('btnCancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', limparFormulario);
    }
});

// Obtém a lista do localStorage
function obterProdutos() {
    return JSON.parse(localStorage.getItem('produtos_shoppee')) || [];
}

// Salva a lista no localStorage
function guardarProdutos(produtos) {
    localStorage.setItem('produtos_shoppee', JSON.stringify(produtos));
}

// Renderiza a tabela do Admin
function carregarTabelaAdmin() {
    const produtos = obterProdutos();
    const tbody = document.getElementById('adminProductList');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    produtos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${prod.imagem}" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td><strong>${prod.nome}</strong></td>
            <td>${prod.categoria}</td>
            <td>R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn-action btn-edit" onclick="prepararEdicao('${prod.id}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-action btn-delete" onclick="excluirProduto('${prod.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Cadastra ou edita um produto
function salvarProduto(e) {
    e.preventDefault();

    let produtos = obterProdutos();
    const id = document.getElementById('productId').value;
    
    const novoProduto = {
        id: id ? id : Date.now().toString(), // Usa timestamp como ID único se for novo
        nome: document.getElementById('productName').value,
        preco: document.getElementById('productPrice').value,
        categoria: document.getElementById('productCategory').value,
        imagem: document.getElementById('productImage').value,
        descricao: document.getElementById('productDescription').value
    };

    if (id) {
        // Modo Edição
        produtos = produtos.map(prod => prod.id === id ? novoProduto : prod);
    } else {
        // Modo Cadastro
        produtos.push(novoProduto);
    }

    guardarProdutos(produtos);
    limparFormulario();
    carregarTabelaAdmin();
}

// Remove um produto
function excluirProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        let produtos = obterProdutos();
        produtos = produtos.filter(prod => prod.id !== id);
        guardarProdutos(produtos);
        carregarTabelaAdmin();
    }
}

// Preenche o formulário para edição
function prepararEdicao(id) {
    const produtos = obterProdutos();
    const prod = produtos.find(p => p.id === id);

    if (prod) {
        document.getElementById('productId').value = prod.id;
        document.getElementById('productName').value = prod.nome;
        document.getElementById('productPrice').value = prod.preco;
        document.getElementById('productCategory').value = prod.categoria;
        document.getElementById('productImage').value = prod.imagem;
        document.getElementById('productDescription').value = prod.descricao;

        document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Atualizar Produto';
        document.getElementById('btnCancel').style.display = 'inline-block';
    }
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-plus"></i> Salvar Produto';
    document.getElementById('btnCancel').style.display = 'none';
}
