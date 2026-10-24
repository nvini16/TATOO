
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

    const API_URL = import.meta.env.VITE_API_URL || '';

    const [agendamentos, setAgendamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [formEdicao, setFormEdicao] = useState({
        nome: '',
        whatsapp: '',
        arte: '',
        estilo: '',
        descricao: '',
        data: '',
        horario: '',
        status: 'aguardando_sinal',
        pagamento_sinal: false,
        valor_sinal: '',
    });

    function iniciarEdicao() {
        if (!agendamentoSelecionado) return;

        setFormEdicao({
            nome: agendamentoSelecionado.clientes?.nome ?? '',
            whatsapp: agendamentoSelecionado.clientes?.whatsapp ?? '',
            arte: agendamentoSelecionado.arte ?? '',
            estilo: agendamentoSelecionado.estilo ?? '',
            descricao: agendamentoSelecionado.descricao ?? '',
            data: agendamentoSelecionado.data?.slice(0,10) ?? '',
            horario: agendamentoSelecionado.horario?.slice(0,5) ?? '',
            status: agendamentoSelecionado.status ?? 'aguardando_sinal',
            pagamento_sinal: agendamentoSelecionado.pagamento_sinal ?? false,
            valor_sinal: agendamentoSelecionado.valor_sinal ?? '',
        });

        setEditando(true);
    }

    function atualizarCampo(event) {
        const { name, value, type, checked } = event.target;

        setFormEdicao((anterior) => ({
            ...anterior,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    
async function salvarEdicao() {
  if (!agendamentoSelecionado || salvando) return;

  setSalvando(true);
  setErro(null);

  try {
    const { data: { session }, error: erroSessao } =
      await supabase.auth.getSession();

    if (erroSessao || !session) {
      throw new Error('Sua sessão expirou. Entre novamente.');
    }

    const resposta = await fetch(
      `${API_URL}/api/agendamentos/${agendamentoSelecionado.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formEdicao,
          valor_sinal:
            formEdicao.valor_sinal === ''
              ? null
              : Number(formEdicao.valor_sinal),
        }),
      }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.erro ||
        resultado.mensagem ||
        'Não foi possível atualizar o agendamento.'
      );
    }

    const atualizado = resultado.agendamento;

    setAgendamentos((anteriores) =>
      anteriores.map((item) =>
        item.id === atualizado.id ? atualizado : item
      )
    );

    setAgendamentoSelecionado(atualizado);
    setEditando(false);
  } catch (erro) {
    setErro(erro.message || 'Erro ao salvar as alterações.');
  } finally {
    setSalvando(false);
  }
}



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

                               <div className="agendamentos-admin-card-btn">
                                 <button
                                    type="button"
                                    onClick={() => {
                                        setEditando(false);
                                        setErro(null);

                                        setAgendamentoSelecionado(agendamento);
                                    }}
                                >
                                    Mais detalhes
                                </button>
                               </div>
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
                {editando && (
                    <form
                        className="agendamentos-admin-form-edicao"
                        onSubmit={(event) => {
                            event.preventDefault();
                            salvarEdicao();
                        }}
                    >
                        <label>
                            Nome do cliente

                            <input
                                name="nome"
                                value={formEdicao.nome}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            WhatsApp

                            <input 
                                name="whatsapp"
                                value={formEdicao.whatsapp}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Arte

                            <input 
                                name="arte"
                                value={formEdicao.arte}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Estilo

                            <input 
                                name="estilo"
                                value={formEdicao.estilo}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Descrição

                            <input 
                                name="descricao"
                                value={formEdicao.descricao}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Data

                            <input 
                                name="data"
                                type="date"
                                value={formEdicao.data}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Horario

                            <input 
                                   name="horario"
                                type="time"
                                value={formEdicao.horario}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>

                        <label>
                            Status

                            <select 
                                name="status"
                                value={formEdicao.status}
                                onChange={atualizarCampo}
                                required
                            >
                        <option value="aguardando_sinal">Aguardando sinal</option>
                        <option value="sinal_pago">Sinal pago</option>
                        <option value="aguardando_confirmacao">Aguardando confirmação</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="faltou">Faltou</option>
                            </select> 
                        </label>

                        <label>
                            Valor do sinal (R$)

                            <input 
                                name="valor_sinal"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formEdicao.valor_sinal}
                                onChange={atualizarCampo}
                            />
                        </label>

                        <label>
                            <input 
                                type="checkbox"
                                name="pagamento_sinal"
                                checked={formEdicao.pagamento_sinal}
                                onChange={atualizarCampo}
                            />
                                Sinal pago
                        </label>

                        <div
                            className="agendamentos-admin-form-acoes"
                        >
                            <button
                                type="submit"
                                disabled={salvando}
                            >
                                {salvando ? 'Salvando...' : 'Salvar alterações'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditando(false)}
                                disabled={salvando}
                            >
                                Cancelar
                            </button>
                        </div>

                    </form>
                )}

                {!editando && (
                    <>

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
                        </>
                    )}
            </div>

            {!editando && (
                <div
                    className="agendamentos-admin-modal-acoes"
                >
                    <button
                        type="button"
                        onClick={iniciarEdicao}
                    >
                        Editar agendamento
                    </button>
                </div>
            )}
        </section>
    </div>
)}



                
            </main>
        </AdminLayout>
    );
}

export default AgendamentosAdmin;

