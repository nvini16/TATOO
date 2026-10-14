
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        let ativo = true;

        async function verificarSessao() {
            const { data: { session }, error } =
                await supabase.auth.getSession();

            if (!ativo) return;

            if (error) {
                setErro('Não foi possível verificar a sessão.');
                return;
            }

            if (session) {
                navigate('/Insights', { replace: true });
            }
        }

        verificarSessao();

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                if (session) {
                    navigate('/Insights', { replace: true });
                }
            });

        return () => {
            ativo = false;
            subscription.unsubscribe();
        };
    }, [navigate]);

    async function handleSubmit(event) {
        event.preventDefault();

        setCarregando(true);
        setMensagem('');
        setErro('');

        try {
            const redirectUrl = new URL(
                'LoginAdmin',
                window.location.origin + import.meta.env.BASE_URL
            ).toString();

            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: false,
                    emailRedirectTo: redirectUrl,
                },
            });

            if (error) {
                throw error;
            }

            setMensagem(
                'Link de acesso enviado. Confira seu e-mail e clique no link para entrar.'
            );
       } catch (error) {
    alert('O catch foi executado!');
    console.error('Erro ao enviar link de acesso:', error);

    setErro(
        error.message || 'Não foi possível enviar o link de acesso.'
    );
} finally {
            setCarregando(false);
        }
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

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando
                            ? 'Enviando...'
                            : 'Enviar link de acesso'}
                    </button>

                    {mensagem && (
                        <p role="status">{mensagem}</p>
                    )}

                    {erro && (
                        <p role="alert">{erro}</p>
                    )}
                </form>

                <Link to="/">Voltar</Link>
            </section>
        </main>
    );
}

export default LoginAdmin;

