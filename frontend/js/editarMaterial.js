(() => {
    const API = {
        vidraria: 'http://192.168.2.106:5000/vidraria',
        acessorio: 'http://192.168.2.106:5000/acessorio',
        reagente: 'http://192.168.2.106:5000/reagente',
        equipamento: 'http://192.168.2.106:5000/equipamento'
    };

    const token = localStorage.getItem('token');

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    const categoria = parametros.get('categoria');

    const formulario = document.querySelector('#form-edicao');

    const campos = {
        categoria: document.querySelector('#categoria'),
        nome: document.querySelector('#nome'),
        descricao: document.querySelector('#descricao'),
        material: document.querySelector('#material'),
        capacidade: document.querySelector('#capacidade'),
        unidade: document.querySelector('#unidade_medida'),
        local: document.querySelector('#local_armazenamento'),
        quantidade: document.querySelector('#quantidade'),
        quantidadeMinima: document.querySelector('#quantidade_minima')
    };

    const grupos = {
        material: document.querySelector('#campo-material'),
        capacidade: document.querySelector('#campo-capacidade'),
        unidade: document.querySelector('#campo-unidade'),
        local: document.querySelector('#campo-local'),
        quantidade: document.querySelector('#campo-quantidade'),
        quantidadeMinima: document.querySelector('#campo-quantidade-minima')
    };

    const nomesCategorias = {
        vidraria: 'Vidraria',
        acessorio: 'Acessório',
        reagente: 'Reagente',
        equipamento: 'Equipamento'
    };

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (!id || !API[categoria]) {
        alert('Material ou categoria inválida.');
        window.location.href = 'vidraria.html';
        return;
    }

    function mostrarCampo(campo, mostrar) {
        grupos[campo].style.display = mostrar ? 'block' : 'none';
    }

    function configurarCampos() {
        campos.categoria.value = nomesCategorias[categoria];

        mostrarCampo(
            'material',
            ['vidraria', 'acessorio', 'equipamento'].includes(categoria)
        );

        mostrarCampo('capacidade', categoria === 'vidraria');

        mostrarCampo(
            'unidade',
            ['vidraria', 'reagente'].includes(categoria)
        );

        mostrarCampo(
            'local',
            ['vidraria', 'acessorio', 'reagente'].includes(categoria)
        );

        mostrarCampo(
            'quantidade',
            ['vidraria', 'acessorio', 'reagente'].includes(categoria)
        );

        mostrarCampo(
            'quantidadeMinima',
            ['vidraria', 'acessorio', 'reagente'].includes(categoria)
        );
    }

    async function requisicao(url, opcoes = {}) {
        const resposta = await fetch(url, {
            ...opcoes,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
                ...opcoes.headers
            }
        });

        const texto = await resposta.text();

        let dados;

        try {
            dados = texto ? JSON.parse(texto) : {};
        } catch {
            console.error('Resposta recebida:', texto);
            throw new Error('A API retornou HTML em vez de JSON. Confira a rota.');
        }

        if (!resposta.ok) {
            throw new Error(dados.error || 'Erro na comunicação com a API.');
        }

        return dados;
    }

    async function carregarMaterial() {
        try {
            const material = await requisicao(`${API[categoria]}/${id}`);

            campos.nome.value = material.nome ?? '';
            campos.descricao.value = material.descricao ?? '';

            if (campos.material) {
                campos.material.value = material.material ?? '';
            }

            if (campos.capacidade) {
                campos.capacidade.value = material.capacidade ?? '';
            }

            if (campos.unidade) {
                campos.unidade.value = material.unidade_medida ?? '';
            }

            if (campos.local) {
                campos.local.value = material.local_armazenamento ?? '';
            }

            if (campos.quantidade) {
                campos.quantidade.value = material.quantidade ?? '';
            }

            if (campos.quantidadeMinima) {
                campos.quantidadeMinima.value = material.quantidade_minima ?? '';
            }

        } catch (error) {
            console.error('Erro ao carregar material:', error);
            alert(error.message);
        }
    }

    function montarDados() {
        const dados = {
            nome: campos.nome.value.trim(),
            descricao: campos.descricao.value.trim() || null
        };

        if (['vidraria', 'acessorio', 'equipamento'].includes(categoria)) {
            dados.material = campos.material.value.trim();
        }

        if (categoria === 'vidraria') {
            dados.capacidade = parseFloat(campos.capacidade.value);
            dados.unidade_medida = campos.unidade.value.trim();
        }

        if (categoria === 'reagente') {
            dados.unidade_medida = campos.unidade.value.trim();
        }

        if (['vidraria', 'acessorio', 'reagente'].includes(categoria)) {
            dados.local_armazenamento = campos.local.value.trim();
            dados.quantidade = parseFloat(campos.quantidade.value);
            dados.quantidade_minima = parseFloat(campos.quantidadeMinima.value);
        }

        return dados;
    }

    function validarDados(dados) {
        if (!dados.nome) {
            alert('Informe o nome.');
            return false;
        }

        if (dados.material !== undefined && !dados.material) {
            alert('Informe o material.');
            return false;
        }

        if (dados.capacidade !== undefined &&
            (!Number.isFinite(dados.capacidade) || dados.capacidade <= 0)) {
            alert('Informe uma capacidade válida.');
            return false;
        }

        if (dados.unidade_medida !== undefined && !dados.unidade_medida) {
            alert('Informe a unidade de medida.');
            return false;
        }

        if (dados.local_armazenamento !== undefined &&
            !dados.local_armazenamento) {
            alert('Informe o local de armazenamento.');
            return false;
        }

        if (dados.quantidade !== undefined &&
            (!Number.isFinite(dados.quantidade) || dados.quantidade < 0)) {
            alert('Informe uma quantidade válida.');
            return false;
        }

        if (dados.quantidade_minima !== undefined &&
            (!Number.isFinite(dados.quantidade_minima) || dados.quantidade_minima < 0)) {
            alert('Informe uma quantidade mínima válida.');
            return false;
        }

        return true;
    }

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = montarDados();

        if (!validarDados(dados)) {
            return;
        }

        try {
            await requisicao(`${API[categoria]}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(dados)
            });

            alert('Material atualizado com sucesso!');
            window.location.href = 'vidraria.html';

        } catch (error) {
            console.error('Erro ao atualizar material:', error);
            alert(error.message);
        }
    });

    configurarCampos();
    carregarMaterial();

})();