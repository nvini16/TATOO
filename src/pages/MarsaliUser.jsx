import { useEffect, useState  } from "react";
import { Link } from 'react-router-dom';
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

    const [agendamentos, setAgendamentos] = useState([]);
    const [carregandoAgenda, setCarregandoAgenda] = useState(false);
    const [erroAgenda, setErroAgenda] = useState('');
    const [agendaCarregada, setAgendaCarregada] = useState(false);

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

    useEffect(() => {
        if (abaAtiva !== 'agenda' || agendaCarregada) return;

        let ativo = true;

        async function carregarAgenda() {
            setCarregandoAgenda(true);
            setErroAgenda('');

            try {
                const {
                    data: { session },
                    error: erroSessao
                } = await supabase.auth.getSession();

                if (erroSessao) throw erroSessao;

                if (!session?.access_token) {
                    throw new Error('Sua sessão expirou. Entre novamente.');
                }

                const resposta = await fetch(
                    `${API_URL}/api/cliente/agendamentos`, {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    }
                );

                const resultado = await resposta.json().catch(() => ({}));

                if (!resposta.ok) {
                    throw new Error(
                        resultado.erro || 'Não foi possível carregar sua agenda.'
                    );
                }

                if (ativo) {
                    setAgendamentos(resultado.agendamentos || []);

                    setAgendaCarregada(true);
                }
            } catch (erro) {
                console.error('Erro ao carregar agenda:', erro);

                if (ativo) {
                    setErroAgenda(
                        erro.message || 'Ocorreu um arro ao consultar sua agenda.'
                    );
                }
            } finally {
                if (ativo) {
                    setAgendaCarregada(false);
                }
            }
        }

        carregarAgenda();

        return () => {
            ativo = false;
        };
    }, [abaAtiva, agendaCarregada])

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
            case 'agenda': {
                const statusAtivos = [
                    'aguardando_sinal',
                    'sinal_pago',
                    'aguardando_confirmacao',
                    'confirmado'
                ];

                const proximosAtendimentos = agendamentos.filter(
                    item => statusAtivos.includes(item.status)
                );

                const historico = agendamentos.filter(
                    item => !statusAtivos.includes(item.status)
                );

                const nomesStatus = {
                    aguardando_sinal: 'Aguardando sinal',
                    sinal_pago: 'Sinal pago',
                    aguardando_confirmacao: 'Aguardando confirmação',
                    confirmado: 'Confirmado',
                    concluido: 'Concluído',
                    cancelado: 'Cancelado',
                    faltou: 'Não compareceu'
                };

                function formatarData(data) {
                    if (!data) return 'Data não informada';

                    const [ano, mes, dia] = data.split('-');

                    return `${dia}/${mes}/${ano}`;
                }

                function renderizarAgendamento(item) {
                    return (
                        <article 
                            className="mu-profile-card"
                            key={item.id}
                        >
                            <div className="mu-profile-field">
                                <span>Trabalho</span>
                                <strong>{item.arte}</strong>
                            </div>

                            <div className="mu-profile-field">
                                <span>Estilo</span>
                                <strong>{item.estilo || 'Não informado'}</strong>
                            </div>

                            <div className="mu-profile-field">
                                <span>Data</span>

                                <strong>{formatarData(item.data)}</strong>
                            </div>

                            <div className="mu-profile-field">
                                <span>Horário</span>
                                <strong>{item.horario?.slice(0, 5) || 'Não informado'}</strong>
                            </div>

                            <div className="mu-profile-field">
                                <span>Status</span>
                                <strong>{nomesStatus[item.status] || 'Status desconhecido'}</strong>
                            </div>
                        </article>
                    );
                }
                return (
                    <section className="mu-section">
                        <div className="mu-section-heading">
                            <div>
                                <span className="mu-eyebrow">SEU ATENDIMENTO</span>
                                
                                <h2>Minha agenda</h2>
                            </div>

                            <CalendarDays />
                        </div>

                        {carregandoAgenda && (
                            <p>Carregando seus agendamentos...</p>
                        )}

                        {erroAgenda && (
                            <div role="alert">
                                <p>{erroAgenda}</p>

                                <button
                                    type="button"
                                    onClick={() => {setAgendaCarregada(false);}}
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        )}

                        {!carregandoAgenda && !erroAgenda && agendaCarregada && (
                            <>
                                <h3>Próximos atendimentos</h3>
                                
                                {proximosAtendimentos.length > 0 ? (proximosAtendimentos.map(renderizarAgendamento)) : (
                                    <div className="mu-empty-state">
                                        <CalendarClock />
                                        <p>Você não possuí próximos agendamentos.</p>
                                    </div>
                                )}

                                <h3>Histórico</h3>

                                {historico.length > 0 ? (historico.map(renderizarAgendamento)) : (
                                    <div className="mu-empty-state">
                                        <Clock3 />
                                        <p>Seus atendimentos anteriores aparecerão aqui.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                );
            }

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