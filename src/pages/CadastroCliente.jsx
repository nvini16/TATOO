import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import fundoCadastro from '../assets/login-image/image-login.jpg';
import logoMarsali from '../assets/logo/marsali-tatoo-logo-fundo-none.png';

function CadastroCliente() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const rotaRetorno = location.state?.from;
    const destinoAposCadastro =
        typeof rotaRetorno === 'string' &&
        rotaRetorno.startsWith('/') &&
        !rotaRetorno.startsWith('//')
            ? rotaRetorno
            : '/Agendamento';

    async function handleSubmit(event) {
        event.preventDefault();

        setMensagem('');
        setErro('');

        if (senha.length < 6) {
            setErro('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        if (senha.length > 72) {
            setErro('A senha não pode ter mais de 72 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setCarregando(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: senha,
                options: {
                    data: {
                        nome: nome.trim(),
                    },
                },
            });

            if (error) {
                throw error;
            }

            if (data.session) {
                navigate(destinoAposCadastro, { replace: true });
                return;
            }

            setMensagem(
                'Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar sua conta. Em seguida, faça login para acessar o sistema.'
            );

            setSenha('');
            setConfirmarSenha('');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setErro('Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <main className="cadastro-page">
                <div className="cadastro-image">
                    <img
                        src={fundoCadastro}
                        alt="Imagem de fundo"
                        aria-hidden="true"
                    />
                </div>

                <Link
                    to="/"
                    className="cadastro-home-link"
                >
                    Voltar
                </Link>

                <section className="cadastro-content">
                    <div className="cadastro-brand">
                        <img src={logoMarsali} alt="Marsali Tattoo" />

                        <h1>Criar conta</h1>

                        <p>Crie sua conta para acompanhar seus agendamentos.</p>
                    </div>

                    <form
                        className="cadastro-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="cadastro-field">
                            <label htmlFor="cadastro-nome">
                                Nome
                            </label>

                            <input
                                id="cadastro-nome"
                                type="text"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                placeholder="Digite seu nome"
                                autoComplete="name"
                                maxLength={50}
                                required
                            />
                        </div>

                        <div className="cadastro-field">
                            <label htmlFor="cadastro-email">
                                E-mail
                            </label>

                            <input
                                id="cadastro-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="seuemail@exemplo.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="cadastro-field">
                            <label htmlFor="cadastro-senha">
                                Senha
                            </label>

                            <div className="cadastro-password-wrapper">
                                <input
                                    id="cadastro-senha"
                                    type={mostrarSenha ? 'text' : 'password'}
                                    value={senha}
                                    onChange={(event) => setSenha(event.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    autoComplete="new-password"
                                    minLength={6}
                                    maxLength={72}
                                    required
                                />

                                <button
                                    type="button"
                                    className="cadastro-password-toggle"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                        </div>

                        <div className="cadastro-field">
                            <label htmlFor="cadastro-confirmar-senha">
                                Confirmar senha
                            </label>

                            <div className="cadastro-password-wrapper">
                                <input
                                    id="cadastro-confirmar-senha"
                                    type={mostrarConfirmacao ? 'text' : 'password'}
                                    value={confirmarSenha}
                                    onChange={(event) => setConfirmarSenha(event.target.value)}
                                    placeholder="Digite sua senha novamente"
                                    autoComplete="new-password"
                                    minLength={6}
                                    maxLength={72}
                                    required
                                />

                                <button
                                    type="button"
                                    className="cadastro-password-toggle"
                                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                                    aria-label={mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {mostrarConfirmacao ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando ? 'Criando conta...' : 'Criar minha conta'}
                        </button>

                        {mensagem && (
                            <p className="cadastro-message" role='status'>
                                {mensagem}
                            </p>
                        )}

                        {erro && (
                            <p className="cadastro-error" role='alert'>
                                {erro}
                            </p>
                        )}
                    </form>

                    <p className="cadastro-login-link">
                        Já possui uma conta?{' '}
                        <Link to="/LoginCliente" state={location.state}>Entrar</Link>
                    </p>
                </section>
            </main>
        </>
    );
}

export default CadastroCliente;
