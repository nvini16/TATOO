
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function LoginAdmin() {
    const [email, setEmail] = useState(''); 
    const [senha, setSenha] = useState(''); 
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    
useEffect(() => {
    let ativo = true;

    async function verificarAcesso(session) {
        if (!session) return;

        setErro('');
        setMensagem('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';

            const resposta = await fetch(
                `${API_URL}/api/admin/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (!ativo) return;

            if (resposta.status === 401 || resposta.status === 403) {
                await supabase.auth.signOut();

                if (ativo) {
                    setErro(
                        'Este e-mail não tem autorização para acessar o painel administrativo.'
                    );
                }

                return;
            }

            if (!resposta.ok) {
                throw new Error(
                    'Não foi possível verificar a autorização administrativa.'
                );
            }

            navigate('/Insights', { replace: true });
        } catch (error) {
            if (ativo) {
                setErro(
                    error.message ||
                    'Erro ao verificar o acesso administrativo.'
                );
            }
        } finally {}
    }

    async function verificarSessao() {
        const { data: { session }, error } =
            await supabase.auth.getSession();

        if (!ativo) return;

        if (error) {
            setErro('Não foi possível verificar a sessão.');
            return;
        }

        if (session) {
            await verificarAcesso(session);
        }
    }

    verificarSessao();

    const { data: { subscription } } =
        supabase.auth.onAuthStateChange((evento, session) => {
            if (evento === 'SIGNED_IN' && session) {
                void verificarAcesso(session);
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
            const {error} = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: senha,
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Erro ao entrar no painel administrativo:', error);

            setErro(
                error.message || 'Não foi possível realizar o login.'
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

                    <label htmlFor="admin-senha">
                        Senha
                    </label>

                    <input 
                        id="admin-senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="Digite sua senha administrativa"
                        autoComplete="current-password"
                        require 
                    />

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando
                            ? 'Entrando...'
                            : 'Entrar'}
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

