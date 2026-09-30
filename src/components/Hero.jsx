import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

function Hero() {

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
            <Link
              className="hero-button"
              type="button"
              to="/agendamentos"
            >
              Agendar horário
            </Link>

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