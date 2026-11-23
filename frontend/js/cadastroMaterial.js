
(() => {
    const formulario = document.querySelector('.cadastro-form');
    const categoria = document.getElementById('categoria');

    const campoMaterial = document.getElementById('campo-material');
    const campoCapacidade = document.getElementById('campo-capacidade');

    const inputMaterial = document.getElementById('material');
    const inputCapacidade = document.getElementById('capacidade');
    const inputUnidade = document.getElementById('unidade_medida');

    const token = localStorage.getItem('token');

    const APIS = {
        vidraria: 'http://localhost:5000/vidraria',
        acessorio: 'http://localhost:5000/acessorio',
        reagente: 'http://localhost:5000/reagente',
        equipamento: 'http://localhost:5000/equipamento'
    };

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

    // Mostra os campos de acordo com a categoria
    function atualizarCampos() {
        const tipo = categoria.value;

        const usaMaterial = ['vidraria', 'acessorio'].includes(tipo);
        const usaCapacidade = tipo === 'vidraria';

        campoMaterial.hidden = !usaMaterial;
        campoCapacidade.hidden = !usaCapacidade;

        inputMaterial.required = usaMaterial;
        inputCapacidade.required = usaCapacidade;
        inputUnidade.required = usaCapacidade;
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
            descricao: document.getElementById('descricao').value.trim() || null,
            local_armazenamento: document.getElementById('local_armazenamento').value.trim(),
            quantidade: parseFloat(document.getElementById('quantidade').value),
            quantidade_minima: parseFloat(document.getElementById('quantidade_minima').value)
        };

        if (tipo === 'vidraria' || tipo === 'acessorio') {
            dados.material = inputMaterial.value.trim();
        }

        if (tipo === 'vidraria') {
            dados.capacidade = parseFloat(inputCapacidade.value);
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

            window.location.href = 'vidraria.html';

        } catch (error) {
            console.error('Erro ao cadastrar material:', error);
            alert(error.message);
        }
    });

    carregarNomeUsuario();

})();
