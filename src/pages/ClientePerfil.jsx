import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminLayout from '../components/AdminLayout';
import ClienteHistorico from '../components/clientePerfil/ClienteHistorico';
import ClienteReferencias from '../components/clientePerfil/ClienteReferencias';

function ClientePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const [cliente, setCliente] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
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
          [401, 403].includes(respostaClientes.status) ||
          [401, 403].includes(respostaAgendamentos.status)
        ) {
          await supabase.auth.signOut();
          navigate('/LoginAdmin', { replace: true });
          return;
        }

        if (!respostaClientes.ok || !respostaAgendamentos.ok) {
          throw new Error('Não foi possível carregar os dados do cliente.');
        }

        const dadosClientes = await respostaClientes.json();
        const dadosAgendamentos = await respostaAgendamentos.json();

        if (
          !Array.isArray(dadosClientes) ||
          !Array.isArray(dadosAgendamentos)
        ) {
          throw new Error('A API retornou dados em formato inválido.');
        }

        const clienteEncontrado = dadosClientes.find(
          (item) => item.id === id
        );

        if (ativo) {
          setCliente(clienteEncontrado || null);
          setAgendamentos(
            dadosAgendamentos.filter(
              (item) => item.cliente_id === id
            )
          );

          if (!clienteEncontrado) {
            setErro('Cliente não encontrado.');
          }
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message || 'Ocorreu um erro ao carregar o perfil.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [id, navigate]);

  const numeroWhatsApp = String(cliente?.whatsapp || '').replace(/\D/g, '');
  const numeroInternacional = numeroWhatsApp.startsWith('55')
    ? numeroWhatsApp
    : `55${numeroWhatsApp}`;
  const whatsappValido =
    (numeroWhatsApp.length === 10 || numeroWhatsApp.length === 11) ||
    (numeroWhatsApp.startsWith('55') &&
      (numeroWhatsApp.length === 12 || numeroWhatsApp.length === 13));
  const linkWhatsApp = whatsappValido
    ? `https://wa.me/${numeroInternacional}`
    : '';

  return (
    <AdminLayout>
      <main className="cliente-perfil-page">
        <h1>Perfil do cliente</h1>

        {carregando && (
          <p role="status">Carregando perfil...</p>
        )}

        {!carregando && erro && (
          <p role="alert">{erro}</p>
        )}

        {!carregando && !erro && cliente && (
          <>
            <section>
              <h2>Dados do cliente</h2>
              <p>
                <strong>Nome:</strong> {cliente.nome}
              </p>
              <p>
                <strong>WhatsApp:</strong> {cliente.whatsapp}
              </p>
              <p>
                <strong>Identificador:</strong> {cliente.id}
              </p>
            </section>

            <section>
              <h2>Visão geral</h2>
              <p>
                <strong>Total de agendamentos:</strong>{' '}
                {agendamentos.length}
              </p>
              <p>
                <strong>Classificação:</strong>{' '}
                {agendamentos.length >= 2
                  ? 'Recorrente'
                  : 'Novo cliente'}
              </p>
            </section>

            <ClienteHistorico agendamentos={agendamentos} />

            <ClienteReferencias clienteId={id} />
          </>
        )}
      </main>

      {!carregando && !erro && cliente && linkWhatsApp && (
        <a
          className="cliente-perfil-contato-fixo"
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conversar com ${cliente.nome} pelo WhatsApp em uma nova aba`}
        >
          <MessageCircle size={22} aria-hidden="true" />
          <span>Falar com cliente</span>
        </a>
      )}
    </AdminLayout>
  );
}

export default ClientePerfil;
