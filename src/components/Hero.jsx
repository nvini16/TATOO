import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="inicio">
      <ScrollReveal>
        <div className="hero-content">

          <p className="hero-label">
            MARSALI TATTOO
          </p>

          <h1>
            Tatuagem não é só
            <br />
            <span>
              uma marca.
            </span>
          </h1>

          <h2>
            É uma história na pele.
          </h2>

          <p>
            Arte, identidade e experiências personalizadas
            para transformar ideias em tatuagens.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              onClick={() => navigate('/Agendamento')}
            >
              Agendar horário
            </button>

            <a className="hero-secondary-button" href="#trabalhos">
              Ver trabalhos
            </a>
          </div>


        </div>
      </ScrollReveal>
    </section>
  )
}

export default Hero;