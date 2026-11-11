import { useEffect, useState  } from "react";
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

function MarsaliUser() {
    const [perfil, setPerfil] = useState(null);
    const [carregando, setcarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const { data: { session }, error: erroSessao } = await supabase.auth.getSession();

                if (erroSessao) {
                    throw erroSessao;
                }

                if (!session?.access_token) {
                    setErro('Você precisa entrar na sua conta para acessar essa área.');
                    return;
                }

                const resposta = await fetch(`${API_URL}/api/cliente/perfil`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    }
                }
            );

            const resultado = await resposta.json().catch(() => ({}));

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || 'Não foi possível carregar seu perfil.'
                );
            }

            setPerfil(resultado.cliente);

            } catch (erro) {
                console.error('Erro ao carregar Marsaliuser:', erro);

                setErro(erro.message || 'Ocorreu um erro ao carregar sua conta.');
            } finally {
                setcarregando(false);
            }
        }

        carregarPerfil();
    }, []);

    if (carregando) {
        return (
            <main className="marsali-user-page">
                <h1>MarsaliUser</h1>
                <p>Carregando seu espaço...</p>
            </main>
        );
    }
    
    if (erro) {
        return (
            <main className="marsali-user-page">
                <h1>MarsaliUser</h1>
                <p role="alert">{erro}</p>
                <Link to="/LoginCliente">Entrar na minha conta</Link>
                <br />
                <Link to="/">Voltar</Link>
            </main>
        );
    }

    if (!perfil) {
        return (
            <main className="marsali-user-page">
                <h1>MarsaliUser</h1>
                <p>Não foi possível localizar os dados do perfil.</p>
                <Link to="/">Voltar</Link>
            </main>
        );
    }
    
    return (
        <>
        <main className="marsali-user-page">
            <header className="marsali-user-header">
                <h1>MarsaliUser</h1>
                <p>Seu espaço pessoal na Marsali Tattoo.</p>
            </header>

            <section className="marsali-user-perfil">
                <h2>Meu perfil</h2>

                <p>
                    <strong>Nome:</strong>
                    {perfil.nome}
                </p>

                <p>
                    <strong>WhatsApp:</strong>

                    {perfil.whatsapp || 'Não informado'}
                </p>
            </section>

            <Link to="/">Voltar</Link>
        </main>
        </>
    );
}

export default MarsaliUser;