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
              d="M520,900 C700,790 790,640 900,500 C1030,335 1200,220 1440,130 L1440,300 C1240,390 1110,500 1010,640 C900,775 820,860 760,900 Z"
            />

            <path 
              className="hero-forma hero-forma-2"
              d="M700,900 C830,810 910,690 1010,560 C1130,405 1270,315 1440,250 L1440,420 C1300,470 1190,560 1110,680 C1030,800 970,870 920,900 Z"
            />

            <path 
  className="hero-forma hero-forma-3"
  d="M0,540 C180,600 430,760 720,850 C850,900 950,700 1050,620 C1160,530 1300,465 1440,420 L1440,900 L0,900 Z"
/>

            <path 
              className="hero-forma hero-forma-4"
              d="M0,700 C220,760 550,850 900,900 C1000,920 1060,730 1130,640 C1220,520 1320,465 1440,420 L1440,590 C1340,620 1280,690 1220,770 C1180,825 1140,875 1110,900 L0,900 Z"
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