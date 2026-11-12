import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

const STATUS_LABELS = {
    aguardando_sinal: 'Aguardando sinal',
    sinal_pago: 'Sinal pago',
    aguardando_confirmacao: 'Aguardando confirmação',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    faltou: 'Faltou',
};

function normalizarTexto(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatarDataLocal(valor) {
    if (!valor) return '';

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) return '';

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

function interpretarData(termo) {
    const texto = termo.trim();
    let ano;
    let mes;
    let dia;

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
    ) {
        return null;
    }

    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function formatarDataHora(criadoEm) {
    if (!criadoEm) return null;

    const data = new Date(criadoEm);

    if (Number.isNaN(data.getTime())) return null;

    return {
        data: data.toLocaleDateString('pt-BR'),
        horario: data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    };
}

function obterStatusLabel(status) {
    if (!status) return 'Não informado';
    return STATUS_LABELS[status] || String(status).replace(/_/g, ' ');
}

function termoCorresponde(termo, referencia) {
    const busca = normalizarTexto(termo);
    if (!busca) return true;

    const camposTexto = [
        referencia.arte,
        referencia.estilo,
    ];

    const statusConhecido = Object.entries(STATUS_LABELS).some(
        ([valor, label]) =>
            normalizarTexto(valor) === busca ||
            normalizarTexto(label) === busca
    );

    if (statusConhecido) {
        const statusEsperado = Object.entries(STATUS_LABELS).find(
            ([valor, label]) =>
                normalizarTexto(valor) === busca ||
                normalizarTexto(label) === busca
        );

        return Boolean(
            statusEsperado &&
            normalizarTexto(referencia.status) === normalizarTexto(statusEsperado[0])
        );
    }

    const dataInterpretada = interpretarData(termo);

    if (dataInterpretada) {
        return (
            formatarDataLocal(referencia.criado_em) === dataInterpretada ||
            referencia.data === dataInterpretada
        );
    }

    // Termos comuns ou não reconhecidos pesquisam todos os metadados.
    const camposDisponiveis = [
        ...camposTexto,
        referencia.status,
        obterStatusLabel(referencia.status),
        referencia.criado_em,
        formatarDataLocal(referencia.criado_em),
        referencia.data,
        referencia.horario,
    ];

    return camposDisponiveis.some(
        (campo) => normalizarTexto(campo).includes(busca)
    );
}

function referenciaCorrespondeBusca(referencia, textoBusca) {
    const termos = textoBusca
        .split('/')
        .map((termo) => termo.trim())
        .filter(Boolean);

    return termos.every((termo) => termoCorresponde(termo, referencia));
}

function ClienteReferencias({ clienteId }) {
    const API_URL = import.meta.env.VITE_API_URL || '';

    const [referencias, setReferencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [referenciaAtiva, setReferenciaAtiva] = useState(null);

    const [busca, setBusca] = useState('');
    const [estiloSelecionado, setEstiloSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [dataEnvioInicio, setDataEnvioInicio] = useState('');
    const [dataEnvioFim, setDataEnvioFim] = useState('');
    const [dataAtendimento, setDataAtendimento] = useState('');
    const [ordenacao, setOrdenacao] = useState('recentes');

    useEffect(() => {
        let ativo = true;

        async function carregarReferencias() {
            setCarregando(true);
            setErro('');
            setReferencias([]);
            setReferenciaAtiva(null);

            try {
                const {
                    data: { session },
                    error: erroSessao,
                } = await supabase.auth.getSession();

                if (erroSessao || !session) {
                    throw new Error('Sessão administrativa não encontrada.');
                }

                const resposta = await fetch(
                    `${API_URL}/api/clientes/${clienteId}/referencias`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );

                if (!resposta.ok) {
                    const dadosErro = await resposta.json().catch(() => ({}));
                    throw new Error(
                        dadosErro.erro || 'Não foi possível carregar as referências.'
                    );
                }

                const dados = await resposta.json();

                if (!Array.isArray(dados)) {
                    throw new Error('A API retornou dados inválidos.');
                }

                if (ativo) {
                    setReferencias(dados);
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message || 'Ocorreu um erro ao carregar as referências.'
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        if (clienteId) {
            carregarReferencias();
        } else {
            setCarregando(false);
            setErro('Identificador do cliente não informado.');
        }

        return () => {
            ativo = false;
        };
    }, [clienteId, API_URL]);

    const estilosDisponiveis = useMemo(() => {
        const estilos = referencias
            .map((referencia) => referencia.estilo)
            .filter((estilo) => typeof estilo === 'string' && estilo.trim());

        return [...new Set(estilos)].sort((a, b) =>
            a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
        );
    }, [referencias]);

    const statusDisponiveis = useMemo(() => {
        const status = referencias
            .map((referencia) => referencia.status)
            .filter((valor) => typeof valor === 'string' && valor.trim());

        return [...new Set(status)].sort((a, b) =>
            obterStatusLabel(a).localeCompare(obterStatusLabel(b), 'pt-BR')
        );
    }, [referencias]);

    const referenciasFiltradas = useMemo(() => {
        const filtradas = referencias.filter((referencia) => {
            if (!referenciaCorrespondeBusca(referencia, busca)) return false;

            if (
                estiloSelecionado &&
                normalizarTexto(referencia.estilo) !== normalizarTexto(estiloSelecionado)
            ) {
                return false;
            }

            if (
                statusSelecionado &&
                referencia.status !== statusSelecionado
            ) {
                return false;
            }

            const dataEnvio = formatarDataLocal(referencia.criado_em);

            if (dataEnvioInicio && (!dataEnvio || dataEnvio < dataEnvioInicio)) {
                return false;
            }

            if (dataEnvioFim && (!dataEnvio || dataEnvio > dataEnvioFim)) {
                return false;
            }

            if (
                dataAtendimento &&
                referencia.data !== dataAtendimento
            ) {
                return false;
            }

            return true;
        });

        return filtradas.sort((a, b) => {
            const valorA = new Date(a.criado_em || '').getTime();
            const valorB = new Date(b.criado_em || '').getTime();
            const validoA = Number.isFinite(valorA);
            const validoB = Number.isFinite(valorB);

            if (!validoA && !validoB) return 0;
            if (!validoA) return 1;
            if (!validoB) return -1;

            return ordenacao === 'antigas'
                ? valorA - valorB
                : valorB - valorA;
        });
    }, [
        referencias,
        busca,
        estiloSelecionado,
        statusSelecionado,
        dataEnvioInicio,
        dataEnvioFim,
        dataAtendimento,
        ordenacao,
    ]);

    function limparFiltros() {
        setBusca('');
        setEstiloSelecionado('');
        setStatusSelecionado('');
        setDataEnvioInicio('');
        setDataEnvioFim('');
        setDataAtendimento('');
        setOrdenacao('recentes');
        setReferenciaAtiva(null);
    }

    function alternarReferencia(id) {
        setReferenciaAtiva((atual) => (atual === id ? null : id));
    }

    const possuiFiltrosAtivos = Boolean(
        busca ||
        estiloSelecionado ||
        statusSelecionado ||
        dataEnvioInicio ||
        dataEnvioFim ||
        dataAtendimento ||
        ordenacao !== 'recentes'
    );

    return (
        <section className="cliente-referencias">
            <h2>Imagens de referência</h2>

            {carregando && (
                <p role="status">Carregando referências...</p>
            )}

            {!carregando && erro && (
                <p role="alert">{erro}</p>
            )}

            {!carregando && !erro && (
                <>
                    <div className="cliente-referencias-filtros">
                        <label className="cliente-referencias-busca">
                            <span>Buscar referências</span>
                            <input
                                type="search"
                                value={busca}
                                onChange={(evento) => setBusca(evento.target.value)}
                                placeholder="Ex.: dragão/old school/confirmado"
                            />
                        </label>

                        <div className="cliente-referencias-filtros-grade">
                            <label>
                                <span>Estilo</span>
                                <select
                                    value={estiloSelecionado}
                                    onChange={(evento) => setEstiloSelecionado(evento.target.value)}
                                >
                                    <option value="">Todos os estilos</option>
                                    {estilosDisponiveis.map((estilo) => (
                                        <option key={estilo} value={estilo}>{estilo}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Status</span>
                                <select
                                    value={statusSelecionado}
                                    onChange={(evento) => setStatusSelecionado(evento.target.value)}
                                >
                                    <option value="">Todos os status</option>
                                    {statusDisponiveis.map((status) => (
                                        <option key={status} value={status}>
                                            {obterStatusLabel(status)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <fieldset className="cliente-referencias-periodo">
                                <legend>Período de envio</legend>
                                <label>
                                    <span>De</span>
                                    <input
                                        type="date"
                                        value={dataEnvioInicio}
                                        max={dataEnvioFim || undefined}
                                        onChange={(evento) => setDataEnvioInicio(evento.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>Até</span>
                                    <input
                                        type="date"
                                        value={dataEnvioFim}
                                        min={dataEnvioInicio || undefined}
                                        onChange={(evento) => setDataEnvioFim(evento.target.value)}
                                    />
                                </label>
                            </fieldset>

                            <label>
                                <span>Data do atendimento</span>
                                <input
                                    type="date"
                                    value={dataAtendimento}
                                    onChange={(evento) => setDataAtendimento(evento.target.value)}
                                />
                            </label>
                        </div>

                        <div className="cliente-referencias-filtros-acoes">
                            <label>
                                <span>Ordenar por envio</span>
                                <select
                                    value={ordenacao}
                                    onChange={(evento) => setOrdenacao(evento.target.value)}
                                >
                                    <option value="recentes">Mais recentes primeiro</option>
                                    <option value="antigas">Mais antigas primeiro</option>
                                </select>
                            </label>

                            <button
                                type="button"
                                className="cliente-referencias-limpar"
                                onClick={limparFiltros}
                                disabled={!possuiFiltrosAtivos}
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>

                    {referencias.length === 0 ? (
                        <p>Este cliente ainda não possui imagens de referência.</p>
                    ) : referenciasFiltradas.length === 0 ? (
                        <p role="status" className="cliente-referencias-sem-resultados">
                            Nenhuma referência corresponde aos critérios informados.
                        </p>
                    ) : (
                        <>
                            <p className="cliente-referencias-contagem" aria-live="polite">
                                {referenciasFiltradas.length === 1
                                    ? '1 referência encontrada'
                                    : `${referenciasFiltradas.length} referências encontradas`}
                            </p>

                            <div className="cliente-referencias-lista">
                                {referenciasFiltradas.map((referencia) => {
                                    const ativa = referenciaAtiva === referencia.id;
                                    const dataHora = formatarDataHora(referencia.criado_em);

                                    return (
                                        <button
                                            className={`cliente-referencia-card${ativa ? ' cliente-referencia-card--ativa' : ''}`}
                                            key={referencia.id}
                                            type="button"
                                            aria-pressed={ativa}
                                            aria-label={`Mostrar informações da referência ${referencia.arte || 'do agendamento'}`}
                                            onClick={() => alternarReferencia(referencia.id)}
                                        >
                                            <img
                                                className="cliente-referencia-imagem"
                                                src={referencia.url}
                                                alt={referencia.arte
                                                    ? `Referência de ${referencia.arte}`
                                                    : 'Imagem de referência do agendamento'}
                                                loading="lazy"
                                            />

                                            <span className="cliente-referencia-degrade">
                                                <span className="cliente-referencia-arte">
                                                    {referencia.arte || 'Arte não informada'}
                                                </span>
                                                <span className="cliente-referencia-data">
                                                    Envio: {dataHora?.data || 'Não informado'}
                                                </span>
                                                <span className="cliente-referencia-horario">
                                                    Horário do envio: {dataHora?.horario || 'Não informado'}
                                                </span>
                                                <span className="cliente-referencia-horario">
                                                    Estilo: {referencia.estilo || 'Não informado'}
                                                </span>
                                                <span className="cliente-referencia-horario">
                                                    Atendimento: {referencia.data
                                                        ? new Date(`${referencia.data}T00:00:00`).toLocaleDateString('pt-BR')
                                                        : 'Não informado'}
                                                </span>
                                                <span className="cliente-referencia-horario">
                                                    Status: {obterStatusLabel(referencia.status)}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="cliente-referencias-instrucao">
                                Selecione uma imagem para visualizar os detalhes.
                            </p>
                        </>
                    )}
                </>
            )}
        </section>
    );
}

export default ClienteReferencias;
