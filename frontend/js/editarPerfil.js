
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

const payload = JSON.parse(atob(
    token.split('.')[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/')
));

const idUsuario = payload.id;

const formPerfil = document.getElementById('form-perfil');
const mensagem = document.getElementById('mensagem');

async function carregarPerfil() {
    try {
        const response = await fetch(
            `http://localhost:5000/usuario/${idUsuario}`,
            {
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
            throw new Error('Erro ao carregar perfil');
        }

        const usuario = await response.json();

        document.getElementById('nome').value = usuario.nome;
        document.getElementById('email').value = usuario.email;

    } catch (error) {
        console.error(error);
        mensagem.textContent = 'Não foi possível carregar seu perfil.';
    }
}

formPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(
            `http://localhost:5000/usuario/${idUsuario}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            mensagem.textContent = data.error || 'Erro ao atualizar perfil.';
            return;
        }

        mensagem.textContent = 'Perfil atualizado com sucesso!';
        document.getElementById('senha').value = '';

    } catch (error) {
        console.error(error);
        mensagem.textContent = 'Erro ao conectar com o servidor.';
    }
});

document.getElementById('btn-excluir').addEventListener('click', async () => {

    const confirmar = confirm(
        'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.'
    );

    if (!confirmar) return;

    try {
        const response = await fetch(
            `http://localhost:5000/usuario/${idUsuario}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Erro ao excluir conta.');
            return;
        }

        localStorage.removeItem('token');

        alert('Sua conta foi excluída com sucesso!');

        window.location.href = 'login.html';

    } catch (error) {
        console.error(error);
        alert('Não foi possível conectar ao servidor.');
    }
});

carregarPerfil();
