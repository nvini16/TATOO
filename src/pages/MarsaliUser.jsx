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

    const [tentativaAgenda, setTentativaAgenda] = useState(0);

    const [referencias, setReferencias] = useState([]);
    const [carregandoReferencias, setCarregandoReferencias] = useState(false);
    const [erroReferencias, setErroReferencias] = useState('');
    const [referenciasCarregadas, setReferenciasCarregadas] = useState(false);
    const [tentativasReferencias, setTentativasReferencias] = useState(0);
    const [referenciaSelecionada, setReferenciaSelecionada] = useState(null);

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
                    setCarregandoAgenda(false);
                }
            }
        }

        carregarAgenda();

        return () => {
            ativo = false;
        };
    }, [abaAtiva, agendaCarregada, tentativaAgenda]);

    useEffect(() => {
        if (abaAtiva !== 'referencias' || referenciasCarregadas) return;

        let ativo = true;

        async function carregarReferencias() {
            setCarregandoReferencias(true);
            setErroReferencias('');

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
                    `${API_URL}/api/cliente/referencias`, {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    }
                );

                const resultado = await resposta.json().catch(() => ({}));

                if (!resposta.ok) {
                    throw new Error(
                        resultado.erro || 'Não foi possível carregar suas referências.'
                    );
                }

                if (ativo) {
                    setReferencias(resultado.referencias || []);
                    setReferenciasCarregadas(true);
                }
            } catch (erro) {
                console.error('Erro ao carregar referências:', erro);

                if (ativo) {
                    setErroReferencias(
                        erro.message || 'Ocorreu um erro ao carregar suas imagens.'
                    );
                }
            } finally {
                if (ativo) {
                    setCarregandoReferencias(false);
                }
            }
        }

        carregarReferencias();

        return () => {
            ativo = false;
        };
    }, [abaAtiva, referenciasCarregadas, tentativasReferencias]);

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
                                    onClick={() => setTentativaAgenda(atual => atual + 1)}
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

            {carregandoReferencias && (
                <p>Carregando suas referências...</p>
            )}

            {erroReferencias && (
                <div role="alert">
                    <p>{erroReferencias}</p>

                    <button
                        type="button"
                        onClick={() => {
                            setReferenciasCarregadas(false);
                            setTentativaReferencias(atual => atual + 1);
                        }}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {!carregandoReferencias &&
                !erroReferencias &&
                referenciasCarregadas && (
                    <>
                        {referencias.length > 0 ? (
                            <div className="mu-reference-grid">
                                {referencias.map(item => (
                                    <button
                                        type="button"
                                        className="mu-reference-item"
                                        key={item.id}
                                        onClick={() => setReferenciaSelecionada(item)}
                                        aria-label={`Visualizar referência: ${item.arte || 'Imagem'}`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.arte || 'Imagem de referência'}
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mu-empty-state">
                                <Image />

                                <h3>Suas imagens</h3>

                                <p>
                                    Suas imagens de referência aparecerão aqui
                                    quando você realizar um agendamento com anexos.
                                </p>
                            </div>
                        )}
                    </>
                )}

            {referenciaSelecionada && (
                <div className="mu-reference-overlay">
                    <section
                        className="mu-reference-viewer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Detalhes da referência"
                    >
                        <button
                            type="button"
                            className="mu-reference-close"
                            onClick={() => setReferenciaSelecionada(null)}
                            aria-label="Fechar visualização"
                        >
                            ×
                        </button>

                        <img
                            src={referenciaSelecionada.url}
                            alt={referenciaSelecionada.arte || 'Imagem de referência'}
                        />

                        <div className="mu-reference-details">
                            <h3>
                                {referenciaSelecionada.arte || 'Sem título'}
                            </h3>

                            <p>
                                <strong>Enviada em:</strong>{' '}
                                {referenciaSelecionada.criado_em
                                    ? new Date(referenciaSelecionada.criado_em)
                                        .toLocaleString('pt-BR')
                                    : 'Não informado'}
                            </p>

                            <p>
                                <strong>Estilo:</strong>{' '}
                                {referenciaSelecionada.estilo || 'Não informado'}
                            </p>

                            <p>
                                <strong>Data do atendimento:</strong>{' '}
                                {referenciaSelecionada.data
                                    ? referenciaSelecionada.data.split('-').reverse().join('/')
                                    : 'Não informado'}
                            </p>

                            <p>
                                <strong>Horário:</strong>{' '}
                                {referenciaSelecionada.horario?.slice(0, 5) || 'Não informado'}
                            </p>

                            <p>
                                <strong>Status:</strong>{' '}
                                {({
                                    aguardando_sinal: 'Aguardando sinal',
                                    sinal_pago: 'Sinal pago',
                                    aguardando_confirmacao: 'Aguardando confirmação',
                                    confirmado: 'Confirmado',
                                    concluido: 'Concluído',
                                    cancelado: 'Cancelado',
                                    faltou: 'Não compareceu'
                                })[referenciaSelecionada.status] || 'Não informado'}
                            </p>
                        </div>
                    </section>
                </div>
            )}
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