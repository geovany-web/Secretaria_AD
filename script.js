const grupos = [
    "homens",
    "mulheres",
    "jovens",
    "adolescentes",
    "criancas",
    "bercario"
];


const nomesGrupos = {

    homens: "HOMENS",

    mulheres: "MULHERES",

    jovens: "JOVENS",

    adolescentes: "ADOLESCENTES",

    criancas: "CRIANÇAS",

    bercario: "BERÇÁRIO"

};



/* =========================
   INICIAR
========================= */

document.addEventListener("DOMContentLoaded", function () {

    colocarDataAtual();

    carregarNomes();

    atualizarResumo();


    /*
        Aqui os botões são encontrados
        pelo JavaScript.
    */

    const botoesAdicionar =
        document.querySelectorAll(".btn-adicionar");


    botoesAdicionar.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const grupo =
                botao.dataset.grupo;

            adicionarPessoa(grupo);

        });

    });


    document
        .getElementById("btnPDF")
        .addEventListener("click", baixarPDF);


    document
        .getElementById("btnNovaChamada")
        .addEventListener("click", novaChamada);


    document
        .getElementById("responsavel")
        .addEventListener("input", salvarNomes);

});



/* =========================
   DATA
========================= */

function colocarDataAtual() {

    const campo =
        document.getElementById("data");


    const hoje = new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    campo.value =
        `${ano}-${mes}-${dia}`;

}



/* =========================
   ADICIONAR PESSOA
========================= */

function adicionarPessoa(grupo) {

    const lista =
        document.getElementById(grupo);


    const pessoa =
        document.createElement("div");


    pessoa.className = "pessoa";


    pessoa.innerHTML = `

        <input
            type="text"
            class="nome-pessoa"
            placeholder="Digite o nome"
        >

        <div class="presenca">

            <button
                type="button"
                class="btn-presente"
            >
                ✓ Presente
            </button>

            <button
                type="button"
                class="btn-falta"
            >
                ✕ Falta
            </button>

        </div>

        <button
            type="button"
            class="btn-remover"
        >
            🗑️
        </button>

    `;


    lista.appendChild(pessoa);


    configurarPessoa(pessoa);


    pessoa
        .querySelector(".nome-pessoa")
        .focus();


    atualizarResumo();

    salvarNomes();

}



/* =========================
   CONFIGURAR PESSOA
========================= */

function configurarPessoa(pessoa) {

    const nome =
        pessoa.querySelector(".nome-pessoa");


    const presente =
        pessoa.querySelector(".btn-presente");


    const falta =
        pessoa.querySelector(".btn-falta");


    const remover =
        pessoa.querySelector(".btn-remover");


    nome.addEventListener(
        "input",
        function () {

            atualizarResumo();

            salvarNomes();

        }
    );


    presente.addEventListener(
        "click",
        function () {

            presente.classList.add("ativo");

            falta.classList.remove("ativo");

            atualizarResumo();

            salvarNomes();

        }
    );


    falta.addEventListener(
        "click",
        function () {

            falta.classList.add("ativo");

            presente.classList.remove("ativo");

            atualizarResumo();

            salvarNomes();

        }
    );


    remover.addEventListener(
        "click",
        function () {

            pessoa.remove();

            atualizarResumo();

            salvarNomes();

        }
    );

}



/* =========================
   RESUMO
========================= */

function atualizarResumo() {

    const pessoas =
        document.querySelectorAll(".pessoa");


    let total = 0;

    let presentes = 0;

    let faltas = 0;


    pessoas.forEach(function (pessoa) {

        const nome =
            pessoa
                .querySelector(".nome-pessoa")
                .value
                .trim();


        if (nome === "") {

            return;

        }


        total++;


        if (
            pessoa
                .querySelector(".btn-presente")
                .classList
                .contains("ativo")
        ) {

            presentes++;

        }


        if (
            pessoa
                .querySelector(".btn-falta")
                .classList
                .contains("ativo")
        ) {

            faltas++;

        }

    });


    document
        .getElementById("totalPessoas")
        .textContent = total;


    document
        .getElementById("totalPresentes")
        .textContent = presentes;


    document
        .getElementById("totalFaltas")
        .textContent = faltas;

}



/* =========================
   SALVAR
========================= */

function salvarNomes() {

    const dados = {

        pessoas: {},

        responsavel:
            document
                .getElementById("responsavel")
                .value

    };


    grupos.forEach(function (grupo) {

        dados.pessoas[grupo] = [];


        const pessoas =
            document.querySelectorAll(
                `#${grupo} .pessoa`
            );


        pessoas.forEach(function (pessoa) {

            const nome =
                pessoa
                    .querySelector(".nome-pessoa")
                    .value
                    .trim();


            /*
                Só salva quem realmente
                escreveu um nome.
            */

            if (nome === "") {

                return;

            }


            let status = "";


            if (
                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .contains("ativo")
            ) {

                status = "presente";

            }


            if (
                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .contains("ativo")
            ) {

                status = "falta";

            }


            dados.pessoas[grupo].push({

                nome: nome,

                status: status

            });

        });

    });


    localStorage.setItem(
        "chamadaADEsmeraldas",
        JSON.stringify(dados)
    );

}



/* =========================
   CARREGAR
========================= */

function carregarNomes() {

    const salvo =
        localStorage.getItem(
            "chamadaADEsmeraldas"
        );


    if (!salvo) {

        return;

    }


    const dados =
        JSON.parse(salvo);


    if (dados.responsavel) {

        document
            .getElementById("responsavel")
            .value =
            dados.responsavel;

    }


    grupos.forEach(function (grupo) {

        const lista =
            document.getElementById(grupo);


        const pessoas =
            dados.pessoas &&
            dados.pessoas[grupo]
                ? dados.pessoas[grupo]
                : [];


        pessoas.forEach(function (item) {

            const pessoa =
                document.createElement("div");


            pessoa.className =
                "pessoa";


            pessoa.innerHTML = `

                <input
                    type="text"
                    class="nome-pessoa"
                    value="${escaparHTML(item.nome)}"
                    placeholder="Digite o nome"
                >

                <div class="presenca">

                    <button
                        type="button"
                        class="btn-presente"
                    >
                        ✓ Presente
                    </button>

                    <button
                        type="button"
                        class="btn-falta"
                    >
                        ✕ Falta
                    </button>

                </div>

                <button
                    type="button"
                    class="btn-remover"
                >
                    🗑️
                </button>

            `;


            lista.appendChild(pessoa);


            configurarPessoa(pessoa);


            if (
                item.status === "presente"
            ) {

                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .add("ativo");

            }


            if (
                item.status === "falta"
            ) {

                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .add("ativo");

            }

        });

    });

}



/* =========================
   ESCAPAR TEXTO
========================= */

function escaparHTML(texto) {

    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================
   NOVA CHAMADA
========================= */

function novaChamada() {

    const confirmar =
        confirm(
            "Iniciar uma nova chamada?\n\nOs nomes continuarão cadastrados, mas todas as presenças e faltas serão apagadas."
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
                .remove("ativo");


            pessoa
                .querySelector(".btn-falta")
                .classList
                .remove("ativo");

        });


    salvarNomes();

    atualizarResumo();

}



/* =========================
   PDF
========================= */

async function baixarPDF() {

    const { jsPDF } =
        window.jspdf;
    
    const logo = new Image();

logo.src = "img/logo.jpeg";

await new Promise(function(resolve) {

    logo.onload = resolve;

});

    const logoPDF =
    imagemParaDataURL(logo);

    const pdf =
        new jsPDF();


    const data =
        document
            .getElementById("data")
            .value;


    const responsavel =
        document
            .getElementById("responsavel")
            .value
            .trim();

let y = 15;


/* LOGO */

pdf.addImage(
    logoPDF,
    "JPEG",
    15,
    10,
    28,
    28
);


    /* CABEÇALHO */

    pdf.setFontSize(17);

    pdf.setFont(undefined, "bold");

    pdf.text(
        "ASSEMBLEIA DE DEUS",
        105,
        y,
        { align: "center" }
    );


    y += 8;


    pdf.setFontSize(14);

    pdf.text(
        "REGIONAL ESMERALDAS",
        105,
        y,
        { align: "center" }
    );


    y += 7;


    pdf.setFontSize(10);

    pdf.setFont(undefined, "normal");

    pdf.text(
        "Ministério de Belo Horizonte",
        105,
        y,
        { align: "center" }
    );


    y += 12;


    pdf.setFontSize(15);

    pdf.setFont(undefined, "bold");

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


    y += 7;


    pdf.text(
        "Quem fez a chamada: " +
        (responsavel || "Não informado"),
        20,
        y
    );


    y += 7;


    pdf.text(
        "Pastor Regional: Pr. Welington Bicalho",
        20,
        y
    );


    y += 7;


    pdf.text(
        "Endereço: Rua Treze de Maio, 170 - Esmeraldas/MG",
        20,
        y
    );


    y += 12;


    let total = 0;

    let presentes = 0;

    let faltas = 0;


    /* GRUPOS */

    grupos.forEach(function (grupo) {

        const pessoas =
            document.querySelectorAll(
                `#${grupo} .pessoa`
            );


        const validas =
            Array.from(pessoas)
                .filter(function (pessoa) {

                    return pessoa
                        .querySelector(".nome-pessoa")
                        .value
                        .trim() !== "";

                });


        /*
            Grupo vazio não aparece
            no PDF.
        */

        if (validas.length === 0) {

            return;

        }


        if (y > 260) {

            pdf.addPage();

            y = 20;

        }


        pdf.setFontSize(12);

        pdf.setFont(undefined, "bold");


        pdf.text(
            nomesGrupos[grupo],
            20,
            y
        );


        y += 7;


        pdf.setFontSize(10);

        pdf.setFont(undefined, "normal");


        validas.forEach(function (
            pessoa,
            index
        ) {

            const nome =
                pessoa
                    .querySelector(".nome-pessoa")
                    .value
                    .trim();


            let status =
                "NÃO MARCADO";


            if (
                pessoa
                    .querySelector(".btn-presente")
                    .classList
                    .contains("ativo")
            ) {

                status =
                    "PRESENTE";

                presentes++;

            }


            if (
                pessoa
                    .querySelector(".btn-falta")
                    .classList
                    .contains("ativo")
            ) {

                status =
                    "FALTA";

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


            if (y > 275) {

                pdf.addPage();

                y = 20;

            }

        });


        y += 5;

    });



    /* RESUMO */

    if (y > 250) {

        pdf.addPage();

        y = 20;

    }


    pdf.setFontSize(13);

    pdf.setFont(undefined, "bold");

    pdf.text(
        "RESUMO DA CHAMADA",
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


    y += 15;


    pdf.text(
        "Responsável pela chamada:",
        20,
        y
    );


    y += 8;


    pdf.line(
        20,
        y,
        100,
        y
    );


    pdf.text(
        responsavel || "Não informado",
        20,
        y + 6
    );


    y += 20;


    pdf.setFontSize(8);

    pdf.text(
        "AD Esmeraldas - Assembleia de Deus - Ministério de Belo Horizonte",
        105,
        y,
        { align: "center" }
    );


    const nomeArquivo =
        data
            ? `chamada-AD-Esmeraldas-${data}.pdf`
            : "chamada-AD-Esmeraldas.pdf";


    pdf.save(nomeArquivo);

}



/* =========================
   FORMATAR DATA
========================= */

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

function imagemParaDataURL(img) {

    const canvas =
        document.createElement("canvas");


    canvas.width =
        img.naturalWidth;


    canvas.height =
        img.naturalHeight;


    const contexto =
        canvas.getContext("2d");


    contexto.drawImage(
        img,
        0,
        0
    );


    return canvas.toDataURL(
        "image/jpeg",
        0.9
    );

}
