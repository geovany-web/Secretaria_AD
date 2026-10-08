```javascript
// Grupos da igreja

const grupos = [
    "homens",
    "mulheres",
    "jovens",
    "adolescentes",
    "criancas",
    "bercario"
];


// Quando abrir o site

document.addEventListener("DOMContentLoaded", function () {

    // Coloca a data atual
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    document.getElementById("data").value =
        `${ano}-${mes}-${dia}`;


    carregarNomes();

    atualizarResumo();

});


// ADICIONAR PESSOA

function adicionarPessoa(grupo) {

    const lista = document.getElementById(grupo);

    const pessoa = document.createElement("div");

    pessoa.className = "pessoa";

    pessoa.innerHTML = `

        <input
            type="text"
            placeholder="Digite o nome"
            oninput="salvarNomes()"
        >

        <div class="presenca">

            <button
                class="btn-presente"
                onclick="marcarPresenca(this, 'presente')"
            >
                ✓ Presente
            </button>

            <button
                class="btn-falta"
                onclick="marcarPresenca(this, 'falta')"
            >
                ✕ Falta
            </button>

        </div>

        <button
            class="btn-remover"
            onclick="removerPessoa(this)"
        >
            🗑️
        </button>

    `;

    lista.appendChild(pessoa);

    atualizarResumo();

    salvarNomes();
}


// MARCAR PRESENÇA OU FALTA

function marcarPresenca(botao, tipo) {

    const pessoa = botao.parentElement;

    const presente =
        pessoa.querySelector(".btn-presente");

    const falta =
        pessoa.querySelector(".btn-falta");


    presente.classList.remove("selecionado-presente");

    falta.classList.remove("selecionado-falta");


    if (tipo === "presente") {

        presente.classList.add("selecionado-presente");

    }

    if (tipo === "falta") {

        falta.classList.add("selecionado-falta");

    }


    atualizarResumo();

    salvarNomes();
}


// REMOVER PESSOA

function removerPessoa(botao) {

    const pessoa = botao.parentElement;

    pessoa.remove();

    atualizarResumo();

    salvarNomes();
}


// ATUALIZAR RESUMO

function atualizarResumo() {

    const pessoas =
        document.querySelectorAll(".pessoa");

    let total = 0;

    let presentes = 0;

    let faltas = 0;


    pessoas.forEach(function (pessoa) {

        const nome =
            pessoa.querySelector("input").value.trim();


        // Não conta pessoa sem nome

        if (nome !== "") {

            total++;

            if (
                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .contains("selecionado-presente")
            ) {

                presentes++;

            }


            if (
                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .contains("selecionado-falta")
            ) {

                faltas++;

            }

        }

    });


    document.getElementById("totalPessoas").textContent =
        total;

    document.getElementById("totalPresentes").textContent =
        presentes;

    document.getElementById("totalFaltas").textContent =
        faltas;
}


// SALVAR NOMES NO NAVEGADOR

function salvarNomes() {

    const dados = {};


    grupos.forEach(function (grupo) {

        dados[grupo] = [];


        const pessoas =
            document.querySelectorAll(
                `#${grupo} .pessoa`
            );


        pessoas.forEach(function (pessoa) {

            const nome =
                pessoa.querySelector("input").value.trim();


            // Só salva quem tem nome

            if (nome !== "") {

                let status = "";

                if (
                    pessoa
                        .querySelector(".btn-presente")
                        .classList
                        .contains("selecionado-presente")
                ) {

                    status = "presente";

                }

                if (
                    pessoa
                        .querySelector(".btn-falta")
                        .classList
                        .contains("selecionado-falta")
                ) {

                    status = "falta";

                }


                dados[grupo].push({

                    nome: nome,

                    status: status

                });

            }

        });

    });


    localStorage.setItem(
        "chamadaIgreja",
        JSON.stringify(dados)
    );


    atualizarResumo();
}


// CARREGAR NOMES

function carregarNomes() {

    const dadosSalvos =
        localStorage.getItem("chamadaIgreja");


    if (!dadosSalvos) {

        return;

    }


    const dados =
        JSON.parse(dadosSalvos);


    grupos.forEach(function (grupo) {

        const lista =
            document.getElementById(grupo);


        if (!dados[grupo]) {

            return;

        }


        dados[grupo].forEach(function (item) {

            const pessoa =
                document.createElement("div");


            pessoa.className = "pessoa";


            pessoa.innerHTML = `

                <input
                    type="text"
                    value="${item.nome}"
                    oninput="salvarNomes()"
                >

                <div class="presenca">

                    <button
                        class="btn-presente"
                        onclick="marcarPresenca(this, 'presente')"
                    >
                        ✓ Presente
                    </button>

                    <button
                        class="btn-falta"
                        onclick="marcarPresenca(this, 'falta')"
                    >
                        ✕ Falta
                    </button>

                </div>

                <button
                    class="btn-remover"
                    onclick="removerPessoa(this)"
                >
                    🗑️
                </button>

            `;


            lista.appendChild(pessoa);


            if (item.status === "presente") {

                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .add("selecionado-presente");

            }


            if (item.status === "falta") {

                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .add("selecionado-falta");

            }

        });

    });


    atualizarResumo();

}


// NOVA CHAMADA

function novaChamada() {

    const confirmar =
        confirm(
            "Deseja iniciar uma nova chamada? Os nomes serão mantidos, mas presença e falta serão apagadas."
        );


    if (!confirmar) {

        return;

    }


    document
        .querySelectorAll(".pessoa")
        .forEach(function (pessoa) {

            pessoa
                .querySelector(".btn-presente")
                .classList
                .remove("selecionado-presente");

            pessoa
                .querySelector(".btn-falta")
                .classList
                .remove("selecionado-falta");

        });


    salvarNomes();

    atualizarResumo();

}


// BAIXAR PDF

function baixarPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();


    const data =
        document.getElementById("data").value;


    let y = 20;


    // TÍTULO

    pdf.setFontSize(18);

    pdf.setFont(undefined, "bold");

    pdf.text(
        "ASSEMBLEIA DE DEUS",
        105,
        y,
        { align: "center" }
    );


    y += 10;


    pdf.setFontSize(14);

    pdf.text(
        "LISTA DE PRESENÇA",
        105,
        y,
        { align: "center" }
    );


    y += 10;


    pdf.setFontSize(10);

    pdf.setFont(undefined, "normal");

    pdf.text(
        "Data: " + formatarData(data),
        20,
        y
    );


    y += 12;


    let total = 0;

    let presentes = 0;

    let faltas = 0;


    const nomesDosGrupos = {

        homens: "HOMENS",

        mulheres: "MULHERES",

        jovens: "JOVENS",

        adolescentes: "ADOLESCENTES",

        criancas: "CRIANÇAS",

        bercario: "BERÇÁRIO"

    };


    grupos.forEach(function (grupo) {

        const pessoas =
            document.querySelectorAll(
                `#${grupo} .pessoa`
            );


        // Só coloca grupo que possui pessoas

        const pessoasValidas =
            Array.from(pessoas).filter(function (pessoa) {

                return pessoa
                    .querySelector("input")
                    .value
                    .trim() !== "";

            });


        if (pessoasValidas.length === 0) {

            return;

        }


        y += 5;


        pdf.setFontSize(13);

        pdf.setFont(undefined, "bold");

        pdf.text(
            nomesDosGrupos[grupo],
            20,
            y
        );


        y += 8;


        pdf.setFontSize(10);

        pdf.setFont(undefined, "normal");


        pessoasValidas.forEach(function (pessoa, index) {

            const nome =
                pessoa
                    .querySelector("input")
                    .value
                    .trim();


            let status = "NÃO MARCADO";


            if (
                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .contains("selecionado-presente")
            ) {

                status = "PRESENTE";

                presentes++;

            }


            if (
                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .contains("selecionado-falta")
            ) {

                status = "FALTA";

                faltas++;

            }


            total++;


            pdf.text(
                `${index + 1}. ${nome}`,
                20,
                y
            );


            pdf.text(
                status,
                150,
                y
            );


            y += 7;


            // Nova página

            if (y > 275) {

                pdf.addPage();

                y = 20;

            }

        });

    });


    // RESUMO

    y += 8;


    if (y > 260) {

        pdf.addPage();

        y = 20;

    }


    pdf.setFont(undefined, "bold");

    pdf.setFontSize(13);

    pdf.text(
        "RESUMO",
        20,
        y
    );


    y += 8;


    pdf.setFontSize(10);

    pdf.setFont(undefined, "normal");


    pdf.text(
        "Total de pessoas: " + total,
        20,
        y
    );


    y += 7;


    pdf.text(
        "Presentes: " + presentes,
        20,
        y
    );


    y += 7;


    pdf.text(
        "Faltas: " + faltas,
        20,
        y
    );


    // RODAPÉ

    y += 15;

    pdf.setFontSize(9);

    pdf.text(
        "Assembleia de Deus - Lista de Presença",
        105,
        y,
        { align: "center" }
    );


    // NOME DO ARQUIVO

    let nomeArquivo = "chamada";

    if (data) {

        nomeArquivo =
            "chamada-" + data;

    }


    pdf.save(
        nomeArquivo + ".pdf"
    );

}


// FORMATAR DATA

function formatarData(data) {

    if (!data) {

        return "Não informada";

    }


    const partes =
        data.split("-");


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}
```
