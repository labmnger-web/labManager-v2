(() => {
    const formulario = document.querySelector('.cadastro-form');
    const categoria = document.getElementById('categoria');
    const token = localStorage.getItem('token');

    const APIS = {
        vidraria: 'http://localhost:5000/vidraria',
        acessorio: 'http://localhost:5000/acessorio',
        reagente: 'http://localhost:5000/reagente',
        equipamento: 'http://localhost:5000/equipamento'
    };

    const campoMaterial = document.getElementById('campo-material');
    const campoCapacidade = document.getElementById('campo-capacidade');
    const campoUnidade = document.getElementById('campo-unidade');
    const campoEstoque = document.getElementById('campo-estoque');

    const inputMaterial = document.getElementById('material');
    const inputCapacidade = document.getElementById('capacidade');
    const inputUnidade = document.getElementById('unidade_medida');
    const inputLocal = document.getElementById('local_armazenamento');
    const inputQuantidade = document.getElementById('quantidade');
    const inputQtdMinima = document.getElementById('quantidade_minima');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Carrega o nome do usuário
    async function carregarNomeUsuario() {
        try {
            const payloadBase64 = token.split('.')[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const payload = JSON.parse(
                atob(payloadBase64.padEnd(
                    payloadBase64.length +
                    (4 - payloadBase64.length % 4) % 4,
                    '='
                ))
            );

            const resposta = await fetch(
                `http://localhost:5000/usuario/${payload.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const usuario = await resposta.json();

            if (!resposta.ok) {
                throw new Error(usuario.error || 'Erro ao buscar usuário.');
            }

            document.getElementById('nome-usuario').textContent =
                usuario.nome.toUpperCase();

        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    // Mostra, exige e habilita apenas os campos da categoria selecionada
    // Mostra, exige e habilita apenas os campos da categoria selecionada
    function atualizarCampos() {
        const tipo = categoria.value;

        const usaMaterial = ['vidraria', 'acessorio', 'equipamento'].includes(tipo);
        const usaCapacidade = tipo === 'vidraria';
        const usaUnidade = ['vidraria', 'reagente'].includes(tipo);
        const usaEstoque = tipo !== 'equipamento' && tipo !== '';

        campoMaterial.hidden = !usaMaterial;
        campoMaterial.style.display = usaMaterial ? '' : 'none';

        campoCapacidade.hidden = !usaCapacidade;
        campoCapacidade.style.display = usaCapacidade ? '' : 'none';

        campoUnidade.hidden = !usaUnidade;
        campoUnidade.style.display = usaUnidade ? '' : 'none';

        campoEstoque.hidden = !usaEstoque;
        campoEstoque.style.display = usaEstoque ? '' : 'none';

        // Material
        inputMaterial.required = usaMaterial;
        inputMaterial.disabled = !usaMaterial;
        if (!usaMaterial) inputMaterial.value = '';

        // Capacidade
        inputCapacidade.required = usaCapacidade;
        inputCapacidade.disabled = !usaCapacidade;
        if (!usaCapacidade) inputCapacidade.value = '';

        // Unidade de medida
        inputUnidade.required = usaUnidade;
        inputUnidade.disabled = !usaUnidade;
        if (!usaUnidade) inputUnidade.value = '';

        // Estoque (Local, Quantidade e Quantidade Mínima)
        [inputLocal, inputQuantidade, inputQtdMinima].forEach((input) => {
            input.required = usaEstoque;
            input.disabled = !usaEstoque;
            if (!usaEstoque) input.value = '';
        });
    }

    categoria.addEventListener('change', atualizarCampos);

    // Cadastra o material
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const tipo = categoria.value;

        if (!APIS[tipo]) {
            alert('Selecione uma categoria.');
            return;
        }

        const dados = {
            nome: document.getElementById('nome').value.trim(),
            descricao: document.getElementById('descricao').value.trim() || null
        };

        if (tipo !== 'equipamento') {
            dados.local_armazenamento = inputLocal.value.trim();
            dados.quantidade = parseFloat(inputQuantidade.value);
            dados.quantidade_minima = parseFloat(inputQtdMinima.value);
        }

        if (['vidraria', 'acessorio', 'equipamento'].includes(tipo)) {
            dados.material = inputMaterial.value.trim();
        }

        if (tipo === 'vidraria') {
            dados.capacidade = parseFloat(inputCapacidade.value);
        }

        if (['vidraria', 'reagente'].includes(tipo)) {
            dados.unidade_medida = inputUnidade.value.trim();
        }

        try {
            const resposta = await fetch(APIS[tipo], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.error || 'Erro ao cadastrar material.');
            }

            alert('Material cadastrado com sucesso!');
            window.location.href = 'material.html';

        } catch (error) {
            console.error('Erro ao cadastrar material:', error);
            alert(error.message);
        }
    });

    atualizarCampos();
    carregarNomeUsuario();
})();