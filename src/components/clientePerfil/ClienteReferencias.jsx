import {useEffect, useState} from 'react';
import {supabase} from '../../lib/supabase';

function ClienteReferencias({clienteId}) {
    const API_URL = import.meta.env.VITE_API_URL || '';

    const [referencias, setReferencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        let ativo = true;

        async function carregarReferencias() {
            setCarregando(true);
            setErro('');
            setReferencias([]);

            try {
                const {
                    data: { session },
                    error: erroSessao,
                } = await supabase.auth.getSession();

                if (erroSessao || !session) {
                    throw new Error(
                        'Sessão administrativa não encontrada.'
                    );
                }

                const resposta = await fetch(
                    `${API_URL}/api/clientes/${clienteId}/referencias`, {
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
            setErro('Identificador do cliente não informado');
        }

        return () => {
            ativo = false;
        };
    }, [clienteId, API_URL]);

    return (
        <section className="cliente-referencias">
            <h2>Imagens de referência</h2>

            {carregando && (
                <p role="status">Carregando referência...</p>
            )}

            {!carregando && erro && (
                <p role="alert">{erro}</p>
            )}

            {!carregando && !erro && referencias.length === 0 && (
                <p>Este cliente ainda não possuí imagens de referência.</p>
            )}

            {!carregando && !erro && referencias.length > 0 && (
                <div className="cliente-referencias-lista">
                    {referencias.map((referencia) => (
                        <article className="cliente-referencia-card" key={referencia.id}>
                            <img src={referencia.url} alt={`Referência para ${referencia.arte || 'o agendamento'}`} />

                            <div>
                                <p>
                                    <strong>Arte:</strong>{''}
                                    {referencia.arte || 'Não informada'}
                                </p>

                                <p>
                                    <strong>Data do agendamento:</strong>{''}
                                    {referencia.data ? new Date(`${referencia.data}T12:00:00`).toLocaleDateString('pt-BR') : 'Não informada'}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default ClienteReferencias;