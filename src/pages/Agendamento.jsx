import './Agendamento.css';
import { Link } from 'react-router-dom';

function Agendamento() {
  return (
    <main className="agendamento-page">
      <section className="agendamento-container">
        <Link className="agendamento-voltar" to="/">
          Voltar para Home
        </Link>

        <div className="agendamento-header">
          <p className="agendamento-eyebrow">Leticia Marsali</p>
          <h1>Agende sua tattoo</h1>
          <p>
            Escolha o trabalho, encontre um horário disponível e conte um pouco
            sobre a tattoo que você deseja fazer.
          </p>
        </div>

        <section className="agendamento-step">
          <span className="agendamento-step-number">1</span>
          <div>
            <h2>Escolha o trabalho</h2>
            <p>Selecione o trabalho ou referência que deseja realizar.</p>
          </div>
        </section>

        <section className="agendamento-step">
          <span className="agendamento-step-number">2</span>
          <div>
            <h2>Escolha o horário</h2>
            <p>Os horários disponíveis serão apresentados nesta etapa.</p>
          </div>
        </section>

        <section className="agendamento-step">
          <span className="agendamento-step-number">3</span>
          <div>
            <h2>Informe seus dados</h2>
            <p>
              Nome, WhatsApp e informações importantes sobre a tattoo serão
              solicitados antes da reserva.
            </p>
          </div>
        </section>

        <section className="agendamento-notice">
          <h2>Como funciona</h2>
          <p>
            Após o pagamento do sinal, o horário ficará reservado
            provisoriamente. A confirmação será feita pelo WhatsApp.
          </p>
        </section>
      </section>
    </main>
  )
}

export default Agendamento
