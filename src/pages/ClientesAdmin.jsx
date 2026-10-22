
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from '../components/AdminLayout';

function ClientesAdmin() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const [clientes, setClientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro('');

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

        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };

        const [respostaClientes, respostaAgendamentos] =
          await Promise.all([
            fetch(`${API_URL}/api`, { headers }),
            fetch(`${API_URL}/api/agendamentos`, { headers }),
          ]);

        if (
          respostaClientes.status === 401 ||
          respostaClientes.status === 403 ||
          respostaAgendamentos.status === 401 ||
          respostaAgendamentos.status === 403
        ) {
          await supabase.auth.signOut();
          navigate('/LoginAdmin', { replace: true });
          return;
        }

        if (!respostaClientes.ok || !respostaAgendamentos.ok) {
          throw new Error(
            'Não foi possível carregar os dados dos clientes.'
          );
        }

        const dadosClientes = await respostaClientes.json();
        const dadosAgendamentos = await respostaAgendamentos.json();

        if (
          !Array.isArray(dadosClientes) ||
          !Array.isArray(dadosAgendamentos)
        ) {
          throw new Error('A API retornou dados em formato inválido.');
        }

        if (ativo) {
          setClientes(dadosClientes);
          setAgendamentos(dadosAgendamentos);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message || 'Ocorreu um erro ao carregar os clientes.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  const clientesComIndicadores = useMemo(() => {
    return clientes.map((cliente) => {
      const totalAgendamentos = agendamentos.filter(
        (agendamento) => agendamento.cliente_id === cliente.id
      ).length;

      return {
        ...cliente,
        totalAgendamentos,
        recorrente: totalAgendamentos >= 2,
      };
    });
  }, [clientes, agendamentos]);

  const totalClientes = clientesComIndicadores.length;

  const totalRecorrentes = clientesComIndicadores.filter(
    (cliente) => cliente.recorrente
  ).length;

  const totalNovos = totalClientes - totalRecorrentes;

  const clientesFiltrados = clientesComIndicadores.filter((cliente) => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');

    return (
      cliente.nome?.toLocaleLowerCase('pt-BR').includes(termo) ||
      cliente.whatsapp?.includes(busca.trim())
    );
  });

  function percentual(valor) {
    if (totalClientes === 0) return 0;
    return Math.round((valor / totalClientes) * 100);
  }

  return (
    <AdminLayout>
      <main className="clientes-admin-page">
        <header className="clientes-admin-header">
          <div>
            <h1>Clientes</h1>
            <p>
              Consulte os cadastros e acompanhe o relacionamento
              com os clientes do estúdio.
            </p>
          </div>
        </header>

        {carregando && (
          <p role="status">Carregando clientes...</p>
        )}

        {!carregando && erro && (
          <p role="alert">{erro}</p>
        )}

        {!carregando && !erro && (
          <>
            <section
              className="clientes-admin-indicadores"
              aria-label="Indicadores de clientes"
            >
              <article className="clientes-admin-indicador">
                <h2>Total de clientes</h2>
                <p>{totalClientes}</p>
                <div
                  className="clientes-admin-barra"
                  role="progressbar"
                  aria-label="Total de clientes"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={totalClientes > 0 ? 100 : 0}
                >
                  <span
                    style={{
                      width: totalClientes > 0 ? '100%' : '0%',
                    }}
                  />
                </div>
                <small>
                  {totalClientes > 0 ? '100%' : '0%'} da base cadastrada
                </small>
              </article>

              <article className="clientes-admin-indicador">
                <h2>Clientes recorrentes</h2>
                <p>{totalRecorrentes}</p>
                <div
                  className="clientes-admin-barra"
                  role="progressbar"
                  aria-label="Clientes recorrentes"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentual(totalRecorrentes)}
                >
                  <span
                    style={{
                      width: `${percentual(totalRecorrentes)}%`,
                    }}
                  />
                </div>
                <small>
                  {percentual(totalRecorrentes)}% da base cadastrada
                </small>
              </article>

              <article className="clientes-admin-indicador">
                <h2>Clientes novos</h2>
                <p>{totalNovos}</p>
                <div
                  className="clientes-admin-barra"
                  role="progressbar"
                  aria-label="Clientes novos"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentual(totalNovos)}
                >
                  <span
                    style={{
                      width: `${percentual(totalNovos)}%`,
                    }}
                  />
                </div>
                <small>
                  {percentual(totalNovos)}% da base cadastrada
                </small>
              </article>
            </section>

            <section className="clientes-admin-listagem">
              <div className="clientes-admin-listagem-topo">
                <div>
                  <h2>Todos os clientes</h2>
                  <p>
                    {clientesFiltrados.length}{' '}
                    {clientesFiltrados.length === 1
                      ? 'cliente encontrado'
                      : 'clientes encontrados'}
                  </p>
                </div>

                <input
                  type="search"
                  aria-label="Buscar cliente por nome ou WhatsApp"
                  placeholder="Buscar por nome ou WhatsApp..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
              </div>

              {clientesFiltrados.length === 0 ? (
                <p>
                  {clientes.length === 0
                    ? 'Nenhum cliente cadastrado.'
                    : 'Nenhum cliente corresponde à busca.'}
                </p>
              ) : (
                <div className="clientes-admin-grid">
                  {clientesFiltrados.map((cliente) => (
                    <article
                      className="clientes-admin-card"
                      key={cliente.id}
                    >
                      <h3>{cliente.nome}</h3>

                      <p>
                        <strong>WhatsApp:</strong>{' '}
                        {cliente.whatsapp}
                      </p>

                      <p>
                        <strong>Agendamentos:</strong>{' '}
                        {cliente.totalAgendamentos}
                      </p>

                      <span
                        className={`clientes-admin-status ${
                          cliente.recorrente
                            ? 'recorrente'
                            : 'novo'
                        }`}
                      >
                        {cliente.recorrente
                          ? 'Recorrente'
                          : 'Novo cliente'}
                      </span>

                      <button
                        type="button"
                        title="Clique aqui para visitar o perfil."
                        onClick={() => navigate(`/ClientePerfil/${cliente.id}`)}
                      >
                        Visitar perfil
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </AdminLayout>
  );
}

export default ClientesAdmin;

