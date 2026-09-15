import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';


function Hero() {

  const navigate = useNavigate();

    return (
        <section className="hero" id="inicio">
          <ScrollReveal>
            <div className="hero-content">
          <p className="hero-label">ESTÚDIO DE TATUAGEM</p>

        <h1>
          Tatuagem não é só
          <br />
          uma marca.
        </h1>

        <h2>É uma história na pele.</h2>
        <p>
          Arte, identidade e experiências personalizadas
          para transformar ideias em tatuagens.
        </p>

        <button type="button" onClick={() => navigate('/Agendamento')}>
          Agendar horário
        </button>
        </div>
          </ScrollReveal>
      </section>
    )
}

export default Hero