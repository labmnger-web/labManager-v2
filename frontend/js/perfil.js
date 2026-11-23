
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
} else {
    async function carregarPerfil() {
        try {
            // Decodifica o conteúdo do JWT para obter o ID
            const partesToken = token.split('.');
            const payloadBase64 = partesToken[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const payload = JSON.parse(atob(payloadBase64));

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

            document.getElementById('nome-usuario').textContent =
                usuario.nome.toUpperCase();

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    carregarPerfil();
}
