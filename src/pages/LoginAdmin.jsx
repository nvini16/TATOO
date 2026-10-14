import { useState } from 'react';
import { Link, useNavigate } from  'react-router-dom';
import { supabase } from '../lib/supabase';

function LoginAdmin() {
    const [email, setEmail] = useState('');

    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const [codigo, setCodigo] = useState('');
    const [codigoEnviado, setCodigoEnviado] = useState(false);

    const navigate = useNavigate();

    
async function handleSubmit(event) {
    event.preventDefault();

    setCarregando(true);
    setMensagem('');
    setErro('');

    try {
        if (!codigoEnviado) {
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: false,
                },
            });

            if (error) {
                throw error;
            }

            setCodigoEnviado(true);
            setMensagem('Código solicitado. Confira seu e-mail.');
        } else {
            const { error } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: codigo.trim(),
                type: 'email',
            });

            if (error) {
                throw error;
            }

            navigate('/Insights')

            setMensagem('Autenticação concluída com sucesso.');
        }
    } catch (error) {
        setErro(
            codigoEnviado
                ? 'Código inválido ou expirado. Confira e tente novamente.'
                : 'Não foi possível solicitar o código. Tente novamente.'
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

                    {codigoEnviado && (
                        <>
                            <label htmlFor="admin-code">
                                Código de acesso
                            </label>

                            <input 
                                id="admin-code"
                                type="text" 
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={codigo}
                                onChange={(event) => setCodigo(
                                    event.target.value.replace(/\D/g, '').slice(0, 8)
                                )
                            }
                            placeholder="Digite os 8 dígitos"
                            maxLength={8}
                            required
                            />
                        </>
                    )}

                    <button type="submit" disabled={carregando || (codigoEnviado && codigo.length !== 8)}>
                       {carregando ? 'Aguarde...' : codigoEnviado ? 'Confirmar código' : 'Enviar código'}
                    </button>

                    {mensagem && <p role="status">{mensagem}</p>}
                    {erro && <p role="alert">{erro}</p>}
                </form>

                <Link to="/">Voltar</Link>
            </section>
        </main>
    );
}

export default LoginAdmin