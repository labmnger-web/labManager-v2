(() => {
    const API = 'http://localhost:5000/historico';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const listaHistorico = document.getElementById('lista-historico');
    const campoPesquisa = document.getElementById('pesquisa');
    const botoesFiltro = document.querySelectorAll('.filtro');
    const nomeUsuario = document.getElementById('nome-usuario');

    let registrosHistorico = [];
    let acaoAtual = 'todos';

    const labelsAcao = {
        CRIOU: 'Cadastro',
        EDITOU: 'Edição',
        DELETOU: 'Exclusão',
        CREATE: 'Cadastro',
        UPDATE: 'Edição',
        DELETE: 'Exclusão'
    };

    const labelsCategoria = {
        VIDRARIA: 'Vidraria',
        PRODUTO_QUIMICO: 'Reagente',
        REAGENTE: 'Reagente',
        ACESSORIO: 'Acessório',
        EQUIPAMENTO: 'Equipamento'
    };

    const carregarNomeUsuario = async () => {
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

    // Busca todos os logs no back-end
    const carregarHistorico = async () => {
        try {
            const response = await fetch(API, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados.error || 'Erro ao carregar histórico.');
            }

            registrosHistorico = dados;
            renderizarTabela();

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            alert(error.message);
        }
    };

    // Filtra e renderiza as linhas na tabela
    // Filtra e renderiza as linhas na tabela
    const renderizarTabela = () => {
        const termo = campoPesquisa ? campoPesquisa.value.trim().toLowerCase() : '';

        const mapaAcoes = {
            CRIOU: ['CRIOU', 'CREATE'],
            EDITOU: ['EDITOU', 'UPDATE'],
            DELETOU: ['DELETOU', 'DELETE']
        };

        const filtrados = registrosHistorico.filter((item) => {
            if (acaoAtual !== 'todos') {
                const acoesPermitidas = mapaAcoes[acaoAtual] || [acaoAtual];
                if (!acoesPermitidas.includes(item.acao)) {
                    return false;
                }
            }

            if (!termo) return true;

            const acao = (labelsAcao[item.acao] || item.acao || '').toLowerCase();
            const nomeItem = item.item_nome?.toLowerCase() || '';
            const categoria = (labelsCategoria[item.categoria] || item.categoria || '').toLowerCase();
            const usuario = item.usuario?.nome?.toLowerCase() || '';

            return (
                acao.includes(termo) ||
                nomeItem.includes(termo) ||
                categoria.includes(termo) ||
                usuario.includes(termo)
            );
        });

        listaHistorico.replaceChildren();

        if (filtrados.length === 0) {
            listaHistorico.innerHTML = `
                <tr class="linha-historico">
                    <td colspan="4">Nenhum registro encontrado no histórico.</td>
                </tr>
            `;
            return;
        }

        filtrados.forEach((item) => {
            const linha = document.createElement('tr');
            linha.classList.add('linha-historico');

            const valores = [
                labelsAcao[item.acao] || item.acao,
                labelsCategoria[item.categoria] || item.categoria,
                item.item_nome ? item.item_nome.toUpperCase() : '-',
                item.usuario?.nome ? item.usuario.nome.toUpperCase() : '-'
            ];

            valores.forEach((valor) => {
                const celula = document.createElement('td');
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            listaHistorico.appendChild(linha);
        });
    };

    // Filtros por tipo de ação
    botoesFiltro.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach((b) => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            acaoAtual = botao.dataset.acao;
            renderizarTabela();
        });
    });

    // Busca em tempo real (se o input existir)
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', renderizarTabela);
    }

    carregarNomeUsuario();
    carregarHistorico();
})();