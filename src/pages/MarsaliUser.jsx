import { useEffect, useState  } from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import {
    LayoutDashboard,
    CalendarDays,
    Image,
    UserRound,
    CalendarClock,
    Clock3,
    ChevronRight,
    Settings
} from 'lucide-react';

import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

const abas = [
    {
        id: 'inicio', nome: 'Inicio', Icone: LayoutDashboard
    },

    {
        id: 'agenda', nome: 'Agenda', Icone: CalendarDays
    },

    {
        id: 'referencias', nome: 'Referências', Icone: Image
    },

    {
        id: 'perfil', nome: 'Perfil', Icone: UserRound
    }
];

function MarsaliUser() {
    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('inicio');

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const {
                    data: { session },
                    error: erroSessao
                } = await supabase.auth.getSession();

                if (erroSessao) throw erroSessao;

                if (!session?.access_token) {
                    setErro('Você precisa entrar na sua conta para aceder a esta área.');
                    return;
                }

                const resposta = await fetch(
                    `${API_URL}/api/cliente/perfil`, {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    }
                );

                const resultado = await resposta.json().catch(() => ({}));

                if (!resposta.ok) {
                    throw new Error(
                        resultado.erro || 'Não tivemos sucesso em carregar seu perfil.'
                    );
                }

                setPerfil(resultado.cliente);
            } catch (erro) {
                console.error('Erro ao carregar MarsaliUser:', erro);

                setErro(
                    erro.message || 'Ocorreu um erro ao carregar sua conta.'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarPerfil();
    }, []);

    if (carregando) {
        return (
            <main className="marsali-user-page">
                <p>Carregando seu estúdio...</p>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="marsali-user-page">
                <h1>Meu estúdio</h1>
                <p role="alert">{erro}</p>
                <Link to="/LoginCliente">Entrar na minha conta</Link>
                <br />
                <Link to="/">Início</Link>
            </main>
        );
    }

    if (!perfil) {
        return (
            <main className="marsali-user-page">
                <h1>Meu estúdio</h1>
                <p>Não foi possível localizar seus dados</p>
                <Link to="/">Início</Link>
            </main>
        );
    }

    const primeiroNome = perfil.nome?.trim().split('')[0] || 'Cliente';

    const iniciais = perfil.nome
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(parte => parte[0])
        .join('')
        .toUpperCase() || 'C';

    function abrirAba(aba) {
        setAbaAtiva(aba);
    }

    function renderizarConteudo() {
        switch (abaAtiva) {
            case 'agenda':
                return (
                    <section className="mu-section">
                        <div className="mu-section-heading">
                            <div>
                                <span className="mu-eyebrow">SEU ATENDIMENTO</span>

                                <h2>Minha agenda</h2>
                            </div>

                            <CalendarDays />
                        </div>

                        <div className="mu-empty-state">

                            <CalendarClock />

                            <h3>Sua agenda</h3>
                            <p>
                                Acompanhe seus agendamentos e consulte agendamentos anteriores em um só lugar.
                            </p>
                        </div>
                    </section>
                );

                case 'referencias':
                    return (


                        <section className="mu-section">
                            <div className="mu-section-heading">
                                <div>
                                    <span className="mu-eyebrow">SUA COLEÇÃO</span>

                                    <h2>Minhas referências</h2>
                                </div>

                                <Image />
                            </div>

                            <div className="mu-empty-state">

                                <image />

                                <h3>Suas imagens</h3>
                                <p>Veja suas referências e imagens em um só lugar.</p>
                            </div>
                        </section>
                    );

                    case 'perfil':
                        return (
                            <section className="mu-section">
                                <div className="mu-section-heading">
                                    <div>
                                        <span className="mu-eyebrow">SUA CONTA</span>
                                        <h2>Seus dados</h2>
                                    </div>

                                    <Settings />
                                </div>

                                <div className="mu-profile-card">
                                    <div className="mu-profile-field">
                                        <span>Nome</span>
                                        <strong>{perfil.nome}</strong>
                                    </div>

                                    <div className="mu-profile-field">
                                        <span>WhatsApp</span>
                                        <strong>{perfil.whatsapp || 'Não informado'}</strong>
                                    </div>

                                    <p>
                                        {/* EDIÇAÕ DO PERFIL. ETAPA POSTERIOR  */}
                                    </p>
                                </div>
                            </section>
                        );

                        default: 
                        return (
                            <section className="mu-section">
                                <div className="mu-welcome">
                                    <span className="mu-eyebrow">ÁREA DO CLIENTE</span>

                                    <h2>Olá, {primeiroNome}!</h2>
                                    <p>
                                        Acompanhe seus atendimentos e organize suas referências em um só lugar.
                                    </p>
                                </div>

                                <div className="mu-dashboard-grid">
                                    <button className="mu-dashboard-card" onClick={() => abrirAba('agenda')}>
                                        <span className="mu-card-icon">
                                            <CalendarDays />
                                        </span>

                                        <span className="mu-card-title">
                                            Minha agenda
                                        </span>

                                        <span className="mu-card-description">
                                            Consulte seus atendimentos
                                        </span>

                                        <ChevronRight className="mu-card-arrow" />
                                    </button>

                                    <button className="mu-dashboard-card" onClick={() => abrirAba('agenda')}>
                                        <span className="mu-card-icon">
                                            <Clock3 />
                                        </span>

                                        <span className="mu-card-title">
                                            Próximo atendimento
                                        </span>

                                        <span className="mu-card-description">
                                            Acompanhe seu próximo orário
                                        </span>

                                        <ChevronRight className="mu-card-arrow" />
                                    </button>

                                    <button className="mu-dashboard-card" onClick={() => abrirAba('referencias')}>
                                        <span className="mu-card-icon">
                                            <image />
                                        </span>

                                        <span className="mu-card-title">
                                            Referências
                                        </span>

                                        <span className="mu-card-description">
                                            Suas imagens e inspirações
                                        </span>
                                        <ChevronRight className="mu-card-arrow"/>
                                    </button>

                                    <button className="mu-dashboard-card" onClick={() => abrirAba('perfil')}>
                                        <span className="mu-card-icon">
                                            <UserRound />
                                        </span>

                                        <span className="mu-card-title">Meu perfil</span>
                                    </button>

                                    <span className="mu-card-description">
                                        Consulte seus dados pessoais
                                    </span>
                                    <ChevronRight className="mu-card-arrow" />
                                </div>
                            </section>
                        );
        }
    }

    return (
        <>
        <Header />
        <main className="marsali-user-page">
            <header className="mu-header">
                <div className="mu-header-content">
                    <div className="mu-avatar" aria-label={`Avatar de ${perfil.nome}`}>
                        {iniciais}
                    </div>

                    <div className="mu-header-info">
                        <span className="mu-header-label">MARSALI TATTOO</span>
                        <h1>{perfil.nome}</h1>
                        <p>{perfil.whatsapp || 'WhatsApp não informado'}</p>
                    </div>
                </div>
            </header>

            <div className="mu-container">
                <nav className="mu-tabs" aria-label="Sessão da área do cliente">
                    {abas.map(({ id, nome, Icone}) => (
                        <button
                            key={id}
                            type="button"
                            className={`mu-tab ${abaAtiva === id ? 'active' : ''}`}
                            onClick={() => abrirAba(id)}
                            aria-pressed={abaAtiva === id}
                        >
                            <Icone />

                            <span>{nome}</span>
                        </button>
                    ))}
                </nav>

                <div 
                    className="mu-content"
                    key={abaAtiva}
                >
                    {renderizarConteudo()}
                </div>

                <footer className="mu-footer">
                    <Link to="/">Aceder á página inícial</Link>
                </footer>
            </div>
        </main>
        </>
    );
}


export default MarsaliUser;