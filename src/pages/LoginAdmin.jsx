import { useState } from 'react';
import { Link } from  'react-router-dom';

function LoginAdmin() {
    const [email, setEmail] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <main className="login-admin-page">
            <section className="login-admin-content">
                <h1>Acesso administrativo</h1>

                <p>
                    Entre com seu e-mail para acessar
                    o painel Marsali Tattoo.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="admin-email">
                        E-mail
                    </label>

                    <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Digite seu e-mail administrativo"
                        autoComplete="email"
                        required
                    />

                    <button type="submit" disabled>
                        Enviar código
                    </button>
                </form>

                <Link to="/">Voltar</Link>
            </section>
        </main>
    );
}

export default LoginAdmin