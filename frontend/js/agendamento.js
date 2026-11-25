(() => {
    const API = 'http://localhost:5000/agendamento';

    const listaAgendamentos =
        document.getElementById('lista-agendamentos')
    const campoPesquisa = document.getElementById('pesquisa');
    const nomeUsuario = document.getElementById('nome-usuario');

    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Formata data ISO ("2026-11-25T00:00:00.000Z") para "25/11/2026"
    function formatarData(dataISO) {
        if (!dataISO) return '-';
        const [ano, mes, dia] = dataISO.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    }

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

    // Busca agendamentos (todos ou filtrados por nome/data)
    async function buscarAgendamentos(termo = '') {
        let url = API;

        if (termo) {
            
            const dataBR = termo.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

            if (dataBR) {
                const [, dia, mes, ano] = dataBR;
                url = `${API}/search?data=${encodeURIComponent(`${ano}-${mes}-${dia}`)}`;
            } else {
                url = `${API}/search?nome=${encodeURIComponent(termo)}`;
            }
        }

        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.error || 'Erro ao buscar agendamentos.');
        }

        return dados;
    }

    // Carrega e renderiza os agendamentos na tabela
    async function carregarAgendamentos() {
        try {
            const termo = campoPesquisa.value.trim();
            const agendamentos = await buscarAgendamentos(termo);

            listaAgendamentos.replaceChildren();

            if (agendamentos.length === 0) {
                listaAgendamentos.innerHTML = `
                    <tr>
                        <td colspan="4">
                            Nenhum agendamento encontrado.
                        </td>
                    </tr>
                `;
                return;
            }

            agendamentos.forEach(agendamento => {
                const linha = document.createElement('tr');

                const valores = [
                    formatarData(agendamento.data),
                    agendamento.turno ?? '-',
                    agendamento.usuario?.nome
                        ? agendamento.usuario.nome.toUpperCase()
                        : '-'
                ];

                valores.forEach(valor => {
                    const celula = document.createElement('td');
                    celula.textContent = valor;
                    linha.appendChild(celula);
                });

                // Ações (Editar e Excluir)
                const acoes = document.createElement('td');

                const editar = document.createElement('a');
                editar.href = `editarAgendamento.html?id=${agendamento.id}`;
                editar.className = 'btn-editar';
                editar.innerHTML =
                    '<img src="../img/editar.png" alt="Editar">';

                const excluir = document.createElement('button');
                excluir.type = 'button';
                excluir.className = 'btn-excluir';
                excluir.innerHTML =
                    '<img src="../img/excluir.png" alt="Excluir">';

                excluir.addEventListener('click', () => {
                    excluirAgendamento(agendamento.id);
                });

                acoes.append(editar, excluir);
                linha.appendChild(acoes);

                listaAgendamentos.appendChild(linha);
            });

        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
            alert(error.message);
        }
    }

    // Exclui um agendamento
    async function excluirAgendamento(id) {
        if (!confirm('Deseja realmente excluir este agendamento?')) {
            return;
        }

        try {
            const resposta = await fetch(`${API}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.error || 'Erro ao excluir agendamento.');
            }

            alert('Agendamento excluído com sucesso!');
            carregarAgendamentos();

        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            alert(error.message);
        }
    }

    // Pesquisa
    campoPesquisa.addEventListener('input', carregarAgendamentos);

    carregarNomeUsuario();
    carregarAgendamentos();

})();