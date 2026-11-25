(() => {
    const API = 'http://localhost:5000/agendamento';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const idAgendamento = params.get('id');

    if (!idAgendamento) {
        alert('ID do agendamento não informado.');
        window.location.href = 'agendamento.html';
        return;
    }

    const formEditar = document.getElementById('form-editar-agendamento');
    const campoData = document.getElementById('data');
    const campoTurno = document.getElementById('turno');
    const campoDescricao = document.getElementById('descricao');

    const carregarDadosAgendamento = async () => {
        try {
            const response = await fetch(`${API}/${idAgendamento}`, {
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

            const agendamento = await response.json();

            if (!response.ok) {
                throw new Error(agendamento.error || 'Erro ao buscar agendamento.');
            }

            if (agendamento.data) {
                campoData.value = agendamento.data.split('T')[0];
            }

            if (agendamento.turno) {
                campoTurno.value = agendamento.turno;
            }

            if (campoDescricao) {
                campoDescricao.value = agendamento.descricao || '';
            }

        } catch (error) {
            console.error('Erro ao carregar agendamento:', error);
            alert(error.message);
            window.location.href = 'agendamento.html';
        }
    };

    if (formEditar) {
        formEditar.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const data = campoData.value;
                const turno = campoTurno.value;
                const descricao = campoDescricao ? campoDescricao.value.trim() : '';

                if (!data || !turno) {
                    alert('Preencha os campos obrigatórios.');
                    return;
                }

                const dadosAtualizados = {
                    data,
                    turno,
                    descricao
                };

                const response = await fetch(`${API}/${idAgendamento}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dadosAtualizados)
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }

                const resultado = await response.json();

                if (!response.ok) {
                    throw new Error(resultado.error || 'Erro ao atualizar agendamento.');
                }

                alert('Agendamento atualizado com sucesso!');
                window.location.href = 'agendamento.html';

            } catch (error) {
                console.error('Erro ao atualizar agendamento:', error);
                alert(error.message);
            }
        });
    }

    carregarDadosAgendamento();
})();