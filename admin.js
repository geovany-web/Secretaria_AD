document.addEventListener('DOMContentLoaded', () => {
    carregarTabelaAdmin();

    const form = document.getElementById('productForm');
    form.addEventListener('submit', salvarProduto);

    document.getElementById('btnCancel').addEventListener('click', limparFormulario);
});

async function carregarTabelaAdmin() {
    try {
        const resposta = await fetch('api.php');
        const produtos = await resposta.json();
        
        const tbody = document.getElementById('adminProductList');
        tbody.innerHTML = '';

        produtos.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${prod.imagem}" onerror="this.src='https://via.placeholder.com/40'"></td>
                <td><strong>${prod.nome}</strong></td>
                <td>${prod.categoria}</td>
                <td>R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="prepararEdicao('${prod.id}', '${escapeHtml(prod.nome)}', '${prod.preco}', '${prod.categoria}', '${prod.imagem}', '${escapeHtml(prod.descricao)}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="excluirProduto('${prod.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar tabela:', erro);
    }
}

async function salvarProduto(e) {
    e.preventDefault();

    const produto = {
        id: document.getElementById('productId').value,
        nome: document.getElementById('productName').value,
        preco: document.getElementById('productPrice').value,
        categoria: document.getElementById('productCategory').value,
        imagem: document.getElementById('productImage').value,
        descricao: document.getElementById('productDescription').value
    };

    const resposta = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });

    const resultado = await resposta.json();
    if (resultado.sucesso) {
        limparFormulario();
        carregarTabelaAdmin();
    }
}

async function excluirProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        await fetch(`api.php?id=${id}`, { method: 'DELETE' });
        carregarTabelaAdmin();
    }
}

function prepararEdicao(id, nome, preco, categoria, imagem, descricao) {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = nome;
    document.getElementById('productPrice').value = preco;
    document.getElementById('productCategory').value = categoria;
    document.getElementById('productImage').value = imagem;
    document.getElementById('productDescription').value = descricao;

    document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Atualizar Produto';
    document.getElementById('btnCancel').style.display = 'inline-block';
}

function limparFormulario() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-plus"></i> Salvar Produto';
    document.getElementById('btnCancel').style.display = 'none';
}

function escapeHtml(texto) {
    return texto.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
