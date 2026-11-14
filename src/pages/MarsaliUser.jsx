import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
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


const STATUS_REFERENCIA_LABELS = {
    aguardando_sinal: 'Aguardando sinal',
    sinal_pago: 'Sinal pago',
    aguardando_confirmacao: 'Aguardando confirmação',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    faltou: 'Não compareceu'
};

function normalizarReferencia(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .replace(/\s+/g, ' ')
        .trim();
}

function dataLocalReferencia(valor) {
    if (!valor) return '';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

function interpretarDataReferencia(termo) {
    const texto = termo.trim();
    let ano, mes, dia;

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        [ano, mes, dia] = texto.split('-').map(Number);
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
        [dia, mes, ano] = texto.split('/').map(Number);
    } else {
        return null;
    }

    const data = new Date(Date.UTC(ano, mes - 1, dia));
    if (
        data.getUTCFullYear() !== ano ||
        data.getUTCMonth() !== mes - 1 ||
        data.getUTCDate() !== dia
    ) return null;

    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function referenciaAtendeTermo(item, termo) {
    const busca = normalizarReferencia(termo);
    if (!busca) return true;

    const statusEncontrado = Object.entries(STATUS_REFERENCIA_LABELS).find(
        ([valor, label]) =>
            normalizarReferencia(valor) === busca ||
            normalizarReferencia(label) === busca
    );

    if (statusEncontrado) {
        return item.status === statusEncontrado[0];
    }

    const data = interpretarDataReferencia(termo);
    if (data) {
        return (
            dataLocalReferencia(item.criado_em) === data ||
            item.data === data
        );
    }

    const campos = [
        item.arte,
        item.estilo,
        item.status,
        STATUS_REFERENCIA_LABELS[item.status],
        item.criado_em,
        dataLocalReferencia(item.criado_em),
        item.data,
        item.horario
    ];

    return campos.some(campo =>
        normalizarReferencia(campo).includes(busca)
    );
}

function referenciaAtendeBusca(item, texto) {
    return texto
        .split('/')
        .map(termo => termo.trim())
        .filter(Boolean)
        .every(termo => referenciaAtendeTermo(item, termo));
}

function MarsaliUser() {
    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('inicio');
    const [saindo, setSaindo] = useState(false);
    const [erroSaida, setErroSaida] = useState('');
    const navigate = useNavigate();

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
    const [buscaReferencias, setBuscaReferencias] = useState('');
    const [estiloReferencia, setEstiloReferencia] = useState('');
    const [statusReferencia, setStatusReferencia] = useState('');
    const [envioInicio, setEnvioInicio] = useState('');
    const [envioFim, setEnvioFim] = useState('');
    const [dataAtendimentoReferencia, setDataAtendimentoReferencia] = useState('');
    const [ordemReferencias, setOrdemReferencias] = useState('recentes');


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

    const estilosReferencia = useMemo(() => [...new Set(
        referencias.map(item => item.estilo).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, 'pt-BR')), [referencias]);

    const statusReferenciaDisponiveis = useMemo(() => [...new Set(
        referencias.map(item => item.status).filter(Boolean)
    )].sort((a, b) =>
        (STATUS_REFERENCIA_LABELS[a] || a).localeCompare(
            STATUS_REFERENCIA_LABELS[b] || b, 'pt-BR'
        )
    ), [referencias]);

    const referenciasFiltradas = useMemo(() => {
        const resultado = referencias.filter(item => {
            if (!referenciaAtendeBusca(item, buscaReferencias)) return false;

            if (
                estiloReferencia &&
                normalizarReferencia(item.estilo) !== normalizarReferencia(estiloReferencia)
            ) return false;

            if (statusReferencia && item.status !== statusReferencia) return false;

            const dataEnvio = dataLocalReferencia(item.criado_em);
            if (envioInicio && (!dataEnvio || dataEnvio < envioInicio)) return false;
            if (envioFim && (!dataEnvio || dataEnvio > envioFim)) return false;
            if (dataAtendimentoReferencia && item.data !== dataAtendimentoReferencia) return false;

            return true;
        });

        return resultado.sort((a, b) => {
            const dataA = new Date(a.criado_em || '').getTime();
            const dataB = new Date(b.criado_em || '').getTime();
            const validaA = Number.isFinite(dataA);
            const validaB = Number.isFinite(dataB);

            if (!validaA && !validaB) return 0;
            if (!validaA) return 1;
            if (!validaB) return -1;

            return ordemReferencias === 'antigas'
                ? dataA - dataB
                : dataB - dataA;
        });
    }, [
        referencias,
        buscaReferencias,
        estiloReferencia,
        statusReferencia,
        envioInicio,
        envioFim,
        dataAtendimentoReferencia,
        ordemReferencias
    ]);

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


    async function sairDaConta() {
        setSaindo(true);
        setErroSaida('');

        try {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) throw error;
            navigate('/', { replace: true });
        } catch (erro) {
            console.error('Erro ao sair da conta:', erro);
            setErroSaida('Não foi possível encerrar sua sessão. Tente novamente.');
            setSaindo(false);
        }
    }

    function limparFiltrosReferencias() {
        setBuscaReferencias('');
        setEstiloReferencia('');
        setStatusReferencia('');
        setEnvioInicio('');
        setEnvioFim('');
        setDataAtendimentoReferencia('');
        setOrdemReferencias('recentes');
        setReferenciaSelecionada(null);
    }

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
                            setTentativasReferencias(atual => atual + 1);
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
                        <div className="mu-reference-filters">
                            <label className="mu-reference-search">
                                <span>Buscar referências</span>
                                <input
                                    type="search"
                                    value={buscaReferencias}
                                    onChange={evento => setBuscaReferencias(evento.target.value)}
                                    placeholder="Ex.: dragão/old school/confirmado"
                                />
                            </label>

                            <div className="mu-reference-filter-grid">
                                <label>
                                    <span>Estilo</span>
                                    <select
                                        value={estiloReferencia}
                                        onChange={evento => setEstiloReferencia(evento.target.value)}
                                    >
                                        <option value="">Todos os estilos</option>
                                        {estilosReferencia.map(estilo => (
                                            <option key={estilo} value={estilo}>{estilo}</option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span>Status</span>
                                    <select
                                        value={statusReferencia}
                                        onChange={evento => setStatusReferencia(evento.target.value)}
                                    >
                                        <option value="">Todos os status</option>
                                        {statusReferenciaDisponiveis.map(status => (
                                            <option key={status} value={status}>
                                                {STATUS_REFERENCIA_LABELS[status] || status}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <fieldset className="mu-reference-period">
                                    <legend>Período de envio</legend>
                                    <label>
                                        <span>De</span>
                                        <input
                                            type="date"
                                            value={envioInicio}
                                            max={envioFim || undefined}
                                            onChange={evento => setEnvioInicio(evento.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <span>Até</span>
                                        <input
                                            type="date"
                                            value={envioFim}
                                            min={envioInicio || undefined}
                                            onChange={evento => setEnvioFim(evento.target.value)}
                                        />
                                    </label>
                                </fieldset>

                                <label>
                                    <span>Data do atendimento</span>
                                    <input
                                        type="date"
                                        value={dataAtendimentoReferencia}
                                        onChange={evento => setDataAtendimentoReferencia(evento.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="mu-reference-filter-actions">
                                <label>
                                    <span>Ordenar por envio</span>
                                    <select
                                        value={ordemReferencias}
                                        onChange={evento => setOrdemReferencias(evento.target.value)}
                                    >
                                        <option value="recentes">Mais recentes primeiro</option>
                                        <option value="antigas">Mais antigas primeiro</option>
                                    </select>
                                </label>

                                <button
                                    type="button"
                                    onClick={limparFiltrosReferencias}
                                    disabled={
                                        !buscaReferencias &&
                                        !estiloReferencia &&
                                        !statusReferencia &&
                                        !envioInicio &&
                                        !envioFim &&
                                        !dataAtendimentoReferencia &&
                                        ordemReferencias === 'recentes'
                                    }
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        </div>

                        {referencias.length > 0 ? (
                            referenciasFiltradas.length > 0 ? (
                                <>
                                    <p className="mu-reference-count" aria-live="polite">
                                        {referenciasFiltradas.length === 1
                                            ? '1 referência encontrada'
                                            : `${referenciasFiltradas.length} referências encontradas`}
                                    </p>
                                    <div className="mu-reference-grid">
                                        {referenciasFiltradas.map(item => (
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
                                </>
                            ) : (
                                <div className="mu-reference-no-results" role="status">
                                    Nenhuma referência corresponde aos critérios informados.
                                </div>
                            )
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

                                    {erroSaida && (
                                        <p className="mu-logout-error" role="alert">{erroSaida}</p>
                                    )}

                                    <button
                                        type="button"
                                        className="mu-logout-button"
                                        onClick={sairDaConta}
                                        disabled={saindo}
                                    >
                                        {saindo ? 'Saindo...' : 'Sair da conta'}
                                    </button>
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
                                            <Image />
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