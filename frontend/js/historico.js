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

    let registrosHistorico = [];
    let acaoAtual = 'todos';

    const labelsAcao = {
        CREATE: 'Cadastro',
        UPDATE: 'Edição',
        DELETE: 'Exclusão'
    };

    const labelsCategoria = {
        VIDRARIA: 'Vidraria',
        PRODUTO_QUIMICO: 'Produto Químico',
        ACESSORIO: 'Acessório',
        EQUIPAMENTO: 'Equipamento'
    };

    // Formata timestamp ISO para "24/11/2026 22:08"
    const formatarDataHora = (dataISO) => {
        if (!dataISO) return '-';
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const min = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${min}`;
    };

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
    const renderizarTabela = () => {
        const termo = campoPesquisa.value.trim().toLowerCase();

        const filtrados = registrosHistorico.filter((item) => {
            if (acaoAtual !== 'todos' && item.acao !== acaoAtual) {
                return false;
            }

            if (!termo) return true;

            const nomeItem = item.item_nome?.toLowerCase() || '';
            const categoria = (labelsCategoria[item.categoria] || item.categoria || '').toLowerCase();
            const usuario = item.usuario?.nome?.toLowerCase() || '';
            const detalhes = item.detalhes?.toLowerCase() || '';

            return (
                nomeItem.includes(termo) ||
                categoria.includes(termo) ||
                usuario.includes(termo) ||
                detalhes.includes(termo)
            );
        });

        listaHistorico.replaceChildren();

        if (filtrados.length === 0) {
            listaHistorico.innerHTML = `
                <tr>
                    <td colspan="6">Nenhum registro encontrado no histórico.</td>
                </tr>
            `;
            return;
        }

        filtrados.forEach((item) => {
            const linha = document.createElement('tr');

            const valores = [
                formatarDataHora(item.data_hora),
                labelsAcao[item.acao] || item.acao,
                labelsCategoria[item.categoria] || item.categoria,
                item.item_nome.toUpperCase(),
                item.detalhes || '-',
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

    // Filtros por tipo de ação (Todos / Cadastros / Edições / Exclusões)
    botoesFiltro.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach((b) => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            acaoAtual = botao.dataset.acao;
            renderizarTabela();
        });
    });

    // Busca em tempo real
    campoPesquisa.addEventListener('input', renderizarTabela);

    carregarHistorico();
})();