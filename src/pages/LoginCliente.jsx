import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import '../styles/loginCliente.css';

import fundoLogin from '../assets/login-image/image-login.jpg';
import logoMarsali from '../assets/logo/marsali-tatoo-logo-fundo-none.png';

function LoginCliente() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const rotaRetorno = location.state?.from;
    const destinoAposLogin =
        typeof rotaRetorno === 'string' &&
        rotaRetorno.startsWith('/') &&
        !rotaRetorno.startsWith('//')
            ? rotaRetorno
            : '/Agendamento';

    async function handleSubmit(event) {
        event.preventDefault();

        setErro('');
        setCarregando(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: senha
            });

            if (error) {
                throw error;
            }

            navigate(destinoAposLogin, { replace: true });
        } catch (error) {
            console.error('Erro ao entrar na conta do cliente:', error);
            setErro(
                'Não foi possível entrar. Verifique seu e-mail e sua senha.'
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main
            className="login-cliente-page"
            style={{ backgroundImage: `url(${fundoLogin})` }}
        >
            <div className="login-cliente-overlay"></div>

            <Link to="/" className="login-cliente-home-link">
                Voltar ao início
            </Link>

            <section className="login-cliente-content">
                <img
                    src={logoMarsali}
                    alt="Marsali Tattoo"
                    className="login-cliente-logo"
                />

                <h1>Bem-vindo de volta</h1>

                <p className="login-cliente-description">
                    Entre na sua conta para continuar.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-cliente-field">
                        <label htmlFor="login-cliente-email">
                            E-mail
                        </label>

                        <input
                            id="login-cliente-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Seu e-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-cliente-field">
                        <label htmlFor="login-cliente-senha">
                            Senha
                        </label>

                        <input
                            id="login-cliente-senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {erro && (
                        <p className="login-cliente-error" role="alert">
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-cliente-button"
                        disabled={carregando}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-cliente-register">
                    Ainda não possui uma conta?{' '}
                    <Link to="/CadastroCliente" state={location.state}>
                        Cadastre-se
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default LoginCliente;
