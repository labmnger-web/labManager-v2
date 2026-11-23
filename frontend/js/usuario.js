
const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        const mensagem = document.getElementById('mensagem');

        if (senha !== confirmarSenha) {
            mensagem.textContent = 'As senhas não coincidem!';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome.trim().toLowerCase(),
                    email: email.trim().toLowerCase(),
                    senha
                })
            });

            const data = await response.json();

            if (!response.ok) {
                mensagem.textContent = data.error || 'Erro ao cadastrar usuário.';
                return;
            }

            mensagem.textContent = 'Cadastro realizado com sucesso!';

            formCadastro.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error('Erro:', error);
            mensagem.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
}
