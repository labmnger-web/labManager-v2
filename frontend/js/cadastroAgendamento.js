(() => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const formAgendamento =
        document.getElementById('form-agendamento') ||
        document.querySelector('.area-agendamentos');

    const campoData = document.getElementById('data');
    const campoTurno = document.getElementById('turno');
    const campoNome = document.getElementById('professor');
    const campoDescricao = document.getElementById('descricao');

    // Decodifica o JWT e preenche o nome do usuário no cabeçalho
    async function carregarPerfil() {
        try {
            const partesToken = token.split('.');
            const payloadBase64 = partesToken[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const payload = JSON.parse(
                atob(payloadBase64.padEnd(
                    payloadBase64.length + (4 - payloadBase64.length % 4) % 4,
                    '='
                ))
            );

            const idUsuario = payload.id;

            const response = await fetch(
                `http://localhost:5000/usuario/${idUsuario}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            if (!response.ok) {
                throw new Error('Erro ao buscar usuário');
            }

            const usuario = await response.json();
            const elementoNome = document.getElementById('nome-usuario');

            if (elementoNome) {
                elementoNome.textContent = usuario.nome.toUpperCase();
            }

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    // Envia o cadastro do agendamento para a API
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const data = campoData.value;
                const turno = campoTurno.value;
                const descricao = campoDescricao ? campoDescricao.value.trim() : '';

                if (!data || !turno) {
                    alert('Preencha os campos obrigatórios.');
                    return;
                }

                const dadosAgendamento = {
                    data,
                    turno,
                    descricao
                };
                console.log(dadosAgendamento);
                const response = await fetch('http://localhost:5000/agendamento', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dadosAgendamento)
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }

                const resultado = await response.json();

                if (!response.ok) {
                    throw new Error(resultado.error || 'Erro ao cadastrar agendamento');
                }

                alert('Agendamento realizado com sucesso!');
                window.location.href = 'agendamento.html';

            } catch (error) {
                console.error('Erro ao cadastrar agendamento:', error);
                alert(error.message);
            }
        });
    }

    carregarPerfil();
})();