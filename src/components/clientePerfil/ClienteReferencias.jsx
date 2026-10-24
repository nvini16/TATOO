import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

function ClienteReferencias({ clienteId }) {
    const API_URL = import.meta.env.VITE_API_URL || '';

    const [referencias, setReferencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [referenciaAtiva, setReferenciaAtiva] = useState(null);

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

    function formatarData(data) {
        if (!data) return 'Data não informada';

        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function alternarReferencia(id) {
        setReferenciaAtiva((atual) => (atual === id ? null : id));
    }

    return (
        <section className="cliente-referencias">
            <h2>Imagens de referência</h2>

            {carregando && (
                <p role="status">Carregando referências...</p>
            )}

            {!carregando && erro && (
                <p role="alert">{erro}</p>
            )}

            {!carregando && !erro && referencias.length === 0 && (
                <p>Este cliente ainda não possui imagens de referência.</p>
            )}

            {!carregando && !erro && referencias.length > 0 && (
                <>
                    <div className="cliente-referencias-lista">
                        {referencias.map((referencia) => {
                            const ativa = referenciaAtiva === referencia.id;

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
                                            Data: {formatarData(referencia.data)}
                                        </span>
                                        <span className="cliente-referencia-horario">
                                            Horário: {referencia.horario?.slice(0, 5) || 'Não informado'}
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
        </section>
    );
}

export default ClienteReferencias;
