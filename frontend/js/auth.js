const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const mensagem = document.getElementById('mensagem');

        try {
            const response = await fetch(
                'http://192.168.2.106:5000/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                mensagem.textContent = data.error || 'Erro ao realizar login.';
                return;
            }

            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Erro:', error);
            mensagem.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
}