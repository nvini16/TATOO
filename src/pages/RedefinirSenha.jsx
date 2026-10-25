import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {supabase} from '../lib/supabase';

function RedefinirSenha() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [modoRedefinicao, setModoRedefinicao] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((evento) => {
            if (evento === 'PASSWORD_RECOVERY') {
                setModoRedefinicao(true);
                setErro('');
                setMensagem('');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function solicitarRecuperacao(event) {
        event.preventDefault();

        setCarregando(true);
        setMensagem('');
        setErro('');

        try {
            const redirectUrl = new URL(
                'RedefinirSenha',
                window.location.origin + import.meta.env.BASE_URL
            ).toString();

            const {error} = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: redirectUrl,
                }
            );

            if (error) {
                throw error;
            }

            setMensagem(
                'Se o e-mail estiver cadastrado, você receberá as intruções para redefinir sua senha.'
            );
        } catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error);

            setErro(
                error.message || 'Não foi possível solicitar a recuperação de senha.'
            );
        } finally {
            setCarregando(false);
        }
    }

    async function salvarNovaSenha(event) {
        event.preventDefault();

        setMensagem('');
        setErro('');

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setCarregando(true);

        try {
            const {error} = await supabase.auth.updateUser({
                password: senha,
            });

            if (error) {
                throw error;
            }

            setMensagem(
                'Senha redefinida com sucesso. Você já pode aceder ao painel administravo.'
            );

            setSenha('');
            setConfirmarSenha('');
            setModoRedefinicao(false);

            await supabase.auth.signOut();
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);

            setErro(
                error.message || 'Não foi possível redefinir senha.'
            );
        } finally {
            setCarregando(false);
        }
    }
    return (
        <main className="login-admin-page">
            <section className="login-admin-content">
                <h1>Recuperar senha</h1>

                {!modoRedefinicao ? (
                    <>
                        <p>
                            Informe seu e-mail administrativo para receber as instruções de recuperação.
                        </p>

                        <form onSubmit={solicitarRecuperacao}>
                            <label htmlFor="recuperacao-email">
                                E-mail
                            </label>

                            <input 
                                type="text" 
                                id="recuperacao-email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Digite seu e-mail administrativo"
                                autoComplete="email"
                                required
                            />
                            
                            <button type="submit" disabled={carregando}>
                                {carregando ? 'Enviando...' : 'Enviar e-mail de recuperação'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p>
                            Cadastre sua nova senha para aceder ao painel.
                        </p>

                        <form onSubmit={salvarNovaSenha}>
                            <label htmlFor="nova-senha">
                                Nova senha
                            </label>

                            <input 
                                type="password"
                                id="nova-senha"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                            <label htmlFor="confirmar-senha">
                                Confirmar nova senha
                            </label>

                            <input 
                                type="password"
                                id="confirmar-senha"
                                value={confirmarSenha}
                                onChange={(event) => setConfirmarSenha(event.target.value)}
                                autoComplete="new-password"
                                minLength={6}
                                required 
                            />

                            <button 
                                type="submit"
                                disabled={carregando}
                            >
                                {carregando ? 'Salvando...' : 'Salvar nova senha'}
                            </button>
                        </form>
                    </>
                )}

                {mensagem && (
                    <p role="status">{mensagem}</p>
                )}

                {erro && (
                    <p role="alert">{erro}</p>
                )}

                <Link to="/LoginAdmin">
                Voltar para login</Link>
            </section>
        </main>
    );
}

export default RedefinirSenha;