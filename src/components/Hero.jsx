import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import estatua from '../assets/hero/estatua-sem-fundo.png';
import fundoNuvens from '../assets/hero/fundo-nuvens.png';

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-cenario">
        <div className="hero-nuvens">
          <img src={fundoNuvens} alt="" aria-hidden='true' />
        </div>

        <div className="hero-camadas-brancas" aria-hidden='true'>
          <svg 
            className="hero-formas"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
          >
            <path 
              className="hero-forma hero-forma-1"
              d="M0,480 C220,420 330,610 540,520 C760,425 850,300 1050,420 C1230,530 1320,430 1440,380 L1440,900 L0,900 Z"
            />

            <path 
              className="hero-forma hero-forma-2"
              d="M0,600 C220,530 390,700 610,610 C830,520 980,450 1150,560 C1290,650 1370,550 1440,520 L1440,900 L0,900 Z"
            />

            <path 
              className="hero-forma hero-forma-3"
              d="M0,720 C260,650 420,780 680,700 C930,620 1100,680 1260,700 C1340,710 1390,680 1440,670 L1440,900 L0,900 Z"
            />
          </svg>
        </div>

        <div className="hero-estatua">
          <img src={estatua} alt="Estátua artística da identidade visual Marsali Tatoo" />
        </div>
      </div>

      <ScrollReveal>
        <div className="hero-content">
          <div className="div-hero-label">
            <p className="hero-label">
              MARSALI TATTOO
            </p>
          </div>

          <h1>
            Tatuagem não é só
            <br />
            <span>uma marca.</span>
          </h1>

          <h2>É uma história na pele.</h2>

          <p>Arte, identidade e experiências personalizadas
            para transformar ideias em tatuagens.
          </p>

          <div className="hero-actions">
            <Link className="hero-button" to="/Agendamento">
            Agendar horário
          </Link>

          <a href="#trabalhos" className="hero-secondary-button">
            Ver trabalhos
          </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default Hero;