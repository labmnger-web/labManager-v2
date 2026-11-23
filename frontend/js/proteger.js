(() => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const partesToken = token.split('.');

        const base64 = partesToken[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payload = JSON.parse(
            atob(base64.padEnd(
                base64.length + (4 - base64.length % 4) % 4,
                '='
            ))
        );

        const expiracao = payload.exp * 1000;

        if (!payload.id || !payload.exp || Date.now() >= expiracao) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }

    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
})();