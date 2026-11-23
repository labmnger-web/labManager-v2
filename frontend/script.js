let botaoMenu = document.getElementById("menu-button");
let menu = document.getElementById("menu");

botaoMenu.addEventListener("click", function() {
    if (menu.style.display == "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});

let pesquisa = document.getElementById("pesquisa");

if (pesquisa) {
    pesquisa.addEventListener("input", function() {
        let texto = pesquisa.value.toLowerCase();
        let linhas = document.querySelectorAll("tbody tr");

        linhas.forEach(function(linha) {
            let conteudo = linha.textContent.toLowerCase();

            if (conteudo.includes(texto)) {
                linha.style.display = "";
            } else {
                linha.style.display = "none";
            }
        });
    });
}
