import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function Insights() {

    const [totalAgendamentos, setTotalAgendamentos] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarAgendamentos() {
            setCarregando(true);
            setErro(null);

            try {
                const {
                    data: { session },
                    error: erroSessao,
                } = await supabase.auth.getSession();

                if (erroSessao || !session) {
                    throw new Error(
                        'Sessão não encontrada. Faça login novamente.'
                    );
                }

                const API_URL = import.meta.env.VITE_API_URL || '';
                const resposta = await fetch(
                    `${API_URL}/api/agendamentos`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );

                if (!resposta.ok) {
                    if (resposta.status === 401 || resposta.status === 403) {
                        throw new Error(
                            'Acesso não autorizado. Verifique sua sessão administrativa.'
                        );
                    }

                    throw new Error(
                        'Não foi possível carregar os agendamentos.'
                    );
                }

                const agendamentos = await resposta.json();

                setTotalAgendamentos(agendamentos.length);
            } catch (error) {
                setErro(
                    error.message
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarAgendamentos();
    }, []);
    return (
        <main className="insights-page">
            <header className="insights-header">
                <div>
                    <h1>Insights</h1>

                    <p>
                        Acompanhe o desenpenho e a rotina do estúdio.
                    </p>
                </div>
            </header>

            <section 
                className="insights-overview"
                aria-label="Visão geral do estúdio"
            >
                <article className="insights-card">
                    <h2>Total de agendamentos</h2>

                    <p className="insights-card-value">
                        {carregando ? 'Carregando...' : totalAgendamentos ?? '-'}
                    </p>
                    <span className="insights-card-description">
                        {erro
                            ? erro 
                            : carregando
                                ? 'Consultando o backend...'
                                : totalAgendamentos !== null
                                    ? 'Agendamentos registrados no sistema'
                                    : 'Nanhum dado carregado'}
                    </span>
                </article>
            </section>
        </main>
    );
}

export default Insights;