<?php
header('Content-Type: application/json; charset=utf-8');

$arquivoJson = 'produtos.json';

// Cria o arquivo JSON básico caso ele ainda não exista
if (!file_exists($arquivoJson)) {
    file_put_contents($arquivoJson, json_encode([]));
}

// Obtém o método HTTP (GET, POST, DELETE, etc.)
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    // Retorna todos os produtos cadastrados
    $produtos = file_get_contents($arquivoJson);
    echo $produtos;
    exit;
}

if ($metodo === 'POST') {
    // Lê os dados enviados via JSON pelo JavaScript
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Dados inválidos.']);
        exit;
    }

    $produtos = json_decode(file_get_contents($arquivoJson), true);

    // Se tiver ID, atualiza (Edição). Se não tiver, cria um novo (Cadastro)
    if (isset($dados['id']) && $dados['id'] !== '') {
        foreach ($produtos as $key => $prod) {
            if ($prod['id'] == $dados['id']) {
                $produtos[$key] = $dados;
                break;
            }
        }
    } else {
        $dados['id'] = uniqid(); // Gera um ID único
        $produtos[] = $dados;
    }

    file_put_contents($arquivoJson, json_encode($produtos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['sucesso' => true, 'mensagem' => 'Produto salvo com sucesso!']);
    exit;
}

if ($metodo === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($id) {
        $produtos = json_decode(file_get_contents($arquivoJson), true);
        
        // Filtra removendo o produto com o ID recebido
        $produtosAtualizados = array_values(array_filter($produtos, function($prod) use ($id) {
            return $prod['id'] != $id;
        }));

        file_put_contents($arquivoJson, json_encode($produtosAtualizados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['sucesso' => true, 'mensagem' => 'Produto removido com sucesso!']);
        exit;
    }
}
?>
