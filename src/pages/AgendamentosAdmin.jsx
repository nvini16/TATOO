
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from '../components/AdminLayout';
import '../styles/adminAgendamentos.css';

function formatarData(data) {
    if (!data) return 'Data não informada';

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
}

function AgendamentosAdmin() {
    const navigate = useNavigate();

    const [agendamentos, setAgendamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

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
                    await supabase.auth.signOut();
                    navigate('/LoginAdmin', { replace: true });
                    return;
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

                if (resposta.status === 401 || resposta.status === 403) {
                    await supabase.auth.signOut();
                    navigate('/LoginAdmin', { replace: true });
                    return;
                }

                if (!resposta.ok) {
                    throw new Error(
                        'Não foi possível carregar os agendamentos.'
                    );
                }

                const dados = await resposta.json();

                if (!Array.isArray(dados)) {
                    throw new Error(
                        'A API retornou uma lista de agendamentos inválida.'
                    );
                }

                setAgendamentos(dados);
            } catch (error) {
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarAgendamentos();
    }, [navigate]);

    return (
        <AdminLayout>
            <main className="agendamentos-admin-page">
                <header className="agendamentos-admin-header">
                    <div>
                        <h1>Agendamentos</h1>
                        <p>
                            Consulte e acompanhe os horários do estúdio.
                        </p>
                    </div>
                </header>

                {carregando && (
                    <p role="status">Carregando agendamentos...</p>
                )}

                {!carregando && erro && (
                    <p role="alert">{erro}</p>
                )}

                {!carregando && !erro && agendamentos.length === 0 && (
                    <p>Nenhum agendamento encontrado.</p>
                )}

                {!carregando && !erro && agendamentos.length > 0 && (
                    <section
                        className="agendamentos-admin-grid"
                        aria-label="Lista de agendamentos"
                    >
                        {agendamentos.map((agendamento) => (
                            <article
                                className="agendamentos-admin-card"
                                key={agendamento.id}
                            >
                                
                                <div className="agendamentos-admin-card-topo">
                                    <h2>{formatarData(agendamento.data)}</h2>

                                    <span className="agendamentos-admin-horario">
                                        {agendamento.horario?.slice(0,5) || '--:--'}
                                    </span>
                                </div>

                                <p>
                                    <strong>Cliente:</strong>{' '}
                                    {agendamento.clientes?.nome || 'Não informado'}
                                </p>

                                <p>
                                    <strong>WhatsApp:</strong>{' '}
                                    {agendamento.clientes?.whatsapp || 'Não informado'}
                                </p>

                                <p>
                                    <strong>Status:</strong>{' '}
                                    {agendamento.status}
                                </p>

                                <button
                                    type="button"
                                    className="agendamentos-admin-detalhes-btn"
                                    onClick={() => setAgendamentoSelecionado(agendamento)}
                                >
                                    Mais detalhes
                                </button>
                            </article>
                        ))}
                    </section>

                    
                )}

                
{agendamentoSelecionado && (
    <div
        className="agendamentos-admin-modal-overlay"
        onClick={() => setAgendamentoSelecionado(null)}
    >
        <section
            className="agendamentos-admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agendamento-modal-titulo"
            onClick={(event) => event.stopPropagation()}
        >
            <header className="agendamentos-admin-modal-header">
                <h2 id="agendamento-modal-titulo">
                    Detalhes do agendamento
                </h2>

                <button
                    type="button"
                    aria-label="Fechar detalhes"
                    onClick={() => setAgendamentoSelecionado(null)}
                >
                    ×
                </button>
            </header>

            <div className="agendamentos-admin-modal-conteudo">
                <p>
                    <strong>Data:</strong>{' '}
                    {formatarData(agendamentoSelecionado.data)}
                </p>

                <p>
                    <strong>Horário:</strong>{' '}
                    {agendamentoSelecionado.horario?.slice(0, 5) || 'Não informado'}
                </p>

                <p>
                    <strong>Cliente:</strong>{' '}
                    {agendamentoSelecionado.clientes?.nome || 'Não informado'}
                </p>

                <p>
                    <strong>WhatsApp:</strong>{' '}
                    {agendamentoSelecionado.clientes?.whatsapp || 'Não informado'}
                </p>

                <p>
                    <strong>Arte:</strong>{' '}
                    {agendamentoSelecionado.arte || 'Não informada'}
                </p>

                <p>
                    <strong>Estilo:</strong>{' '}
                    {agendamentoSelecionado.estilo || 'Não informado'}
                </p>

                <p>
                    <strong>Descrição:</strong>{' '}
                    {agendamentoSelecionado.descricao || 'Sem descrição'}
                </p>

                <p>
                    <strong>Status:</strong>{' '}
                    {agendamentoSelecionado.status}
                </p>

                <p>
                    <strong>Sinal pago:</strong>{' '}
                    {agendamentoSelecionado.pagamento_sinal ? 'Sim' : 'Não'}
                </p>

                <p>
                    <strong>Valor do sinal:</strong>{' '}
                    {agendamentoSelecionado.valor_sinal != null
                        ? Number(agendamentoSelecionado.valor_sinal)
                            .toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })
                        : 'Não informado'}
                </p>
            </div>
        </section>
    </div>
)}



                
            </main>
        </AdminLayout>
    );
}

export default AgendamentosAdmin;

