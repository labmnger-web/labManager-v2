
(() => {
    const APIS = {
        vidraria: 'http://localhost:5000/vidraria',
        acessorio: 'http://localhost:5000/acessorio',
        reagente: 'http://localhost:5000/reagente',
        equipamento: 'http://localhost:5000/equipamento'
    };

    const listaMateriais = document.getElementById('lista-materiais');
    const cabecalhoTabela = document.getElementById('cabecalho-tabela');
    const campoPesquisa = document.getElementById('pesquisa');
    const nomeUsuario = document.getElementById('nome-usuario');
    const filtros = document.querySelectorAll('.filtro');

    const token = localStorage.getItem('token');

    let categoriaAtual = 'todos';

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

            if (nomeUsuario) {
                nomeUsuario.textContent = usuario.nome.toUpperCase();
            }

        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    // Busca materiais de uma categoria
    async function buscarMateriais(categoria, nome = '') {
        const API = APIS[categoria];

        const url = nome
            ? `${API}/search?nome=${encodeURIComponent(nome)}`
            : API;

        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.error || 'Erro ao buscar materiais.');
        }

        return dados.map(material => ({
            ...material,
            categoria
        }));
    }

    // Monta o cabeçalho da tabela
    function montarCabecalho() {
        let colunas;

        if (categoriaAtual === 'todos') {
            colunas = [
                'Nome',
                'Categoria',
                'Capacidade',
                'Unidade de medida',
                'Material',
                'Local de armazenamento',
                'Quantidade',
                'Quantidade mínima',
                'Ações'
            ];
        } else if (categoriaAtual === 'vidraria') {
            colunas = [
                'Nome',
                'Capacidade',
                'Unidade de medida',
                'Material',
                'Local de armazenamento',
                'Quantidade',
                'Quantidade mínima',
                'Ações'
            ];
        } else if (categoriaAtual === 'acessorio') {
            colunas = [
                'Nome',
                'Material',
                'Local de armazenamento',
                'Quantidade',
                'Quantidade mínima',
                'Ações'
            ];
        } else {
            colunas = [
                'Nome',
                'Descrição',
                'Local de armazenamento',
                'Quantidade',
                'Quantidade mínima',
                'Ações'
            ];
        }

        cabecalhoTabela.innerHTML = `
            <tr>
                ${colunas.map(coluna => `<th>${coluna}</th>`).join('')}
            </tr>
        `;
    }

    // Carrega os materiais
    async function carregarMateriais() {
        try {
            const nome = campoPesquisa.value.trim();

            const categorias = categoriaAtual === 'todos'
                ? Object.keys(APIS)
                : [categoriaAtual];

            const resultados = await Promise.all(
                categorias.map(categoria =>
                    buscarMateriais(categoria, nome)
                )
            );

            const materiais = resultados.flat();

            listaMateriais.replaceChildren();
            montarCabecalho();

            if (materiais.length === 0) {
                const quantidadeColunas =
                    cabecalhoTabela.querySelectorAll('th').length;

                listaMateriais.innerHTML = `
                    <tr>
                        <td colspan="${quantidadeColunas}">
                            Nenhum material encontrado.
                        </td>
                    </tr>
                `;
                return;
            }

            materiais.forEach(material => {
                const linha = document.createElement('tr');

                let valores;

                if (categoriaAtual === 'todos') {
                    valores = [
                        material.nome.toUpperCase(),
                        material.categoria,
                        material.capacidade ?? '-',
                        material.unidade_medida ?? '-',
                        material.material ?? '-',
                        material.local_armazenamento ?? '-',
                        material.quantidade ?? '-',
                        material.quantidade_minima ?? '-'
                    ];
                } else if (material.categoria === 'vidraria') {
                    valores = [
                        material.nome.toUpperCase(),
                        material.capacidade ?? '-',
                        material.unidade_medida ?? '-',
                        material.material ?? '-',
                        material.local_armazenamento ?? '-',
                        material.quantidade ?? '-',
                        material.quantidade_minima ?? '-'
                    ];
                } else if (material.categoria === 'acessorio') {
                    valores = [
                        material.nome.toUpperCase(),
                        material.material ?? '-',
                        material.local_armazenamento ?? '-',
                        material.quantidade ?? '-',
                        material.quantidade_minima ?? '-'
                    ];
                } else {
                    valores = [
                        material.nome.toUpperCase(),
                        material.descricao ?? '-',
                        material.local_armazenamento ?? '-',
                        material.quantidade ?? '-',
                        material.quantidade_minima ?? '-'
                    ];
                }

                valores.forEach(valor => {
                    const celula = document.createElement('td');
                    celula.textContent = valor ?? '-';
                    linha.appendChild(celula);
                });

                // Ações
                const acoes = document.createElement('td');

                const editar = document.createElement('a');
                editar.href = `editarVidraria.html?id=${material.id}&categoria=${material.categoria}`;
                editar.className = 'btn-editar';
                editar.innerHTML =
                    '<img src="../img/editar.png" alt="Editar">';

                const excluir = document.createElement('button');
                excluir.type = 'button';
                excluir.className = 'btn-excluir';
                excluir.innerHTML =
                    '<img src="../img/excluir.png" alt="Excluir">';

                excluir.addEventListener('click', () => {
                    excluirMaterial(material.id, material.categoria);
                });

                acoes.append(editar, excluir);
                linha.appendChild(acoes);

                listaMateriais.appendChild(linha);
            });

        } catch (error) {
            console.error('Erro ao carregar materiais:', error);
            alert(error.message);
        }
    }

    // Exclui um material
    async function excluirMaterial(id, categoria) {
        if (!confirm('Deseja realmente excluir este material?')) {
            return;
        }

        try {
            const resposta = await fetch(`${APIS[categoria]}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.error || 'Erro ao excluir material.');
            }

            alert('Material excluído com sucesso!');
            carregarMateriais();

        } catch (error) {
            console.error('Erro ao excluir material:', error);
            alert(error.message);
        }
    }

    // Filtros
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            filtros.forEach(botao => botao.classList.remove('ativo'));

            filtro.classList.add('ativo');
            categoriaAtual = filtro.dataset.categoria;

            carregarMateriais();
        });
    });

    // Pesquisa
    campoPesquisa.addEventListener('input', carregarMateriais);

    carregarNomeUsuario();
    carregarMateriais();

})();
