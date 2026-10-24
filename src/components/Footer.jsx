import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import logo from '../assets/logo/marsali-tatoo-logo-fundo-none.png';

function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-conteudo">
        <section className="footer-marca">
          <img
            src={logo}
            alt="Marsali Tattoo Studio"
            className="footer-logo"
          />

          <h2>Marsali Tattoo</h2>
        </section>

        <nav className="footer-navegacao" aria-label="Navegação do rodapé">
          <h3>Navegação</h3>

          <a href="#inicio">Início</a>
          <a href="#trabalhos">Galeria de trabalhos</a>
          <a href="#cuidados">Cuidados</a>
          <a href="#sobre">Sobre</a>
          <Link to="/Agendamento">Agendar horário</Link>
        </nav>

        <section className="footer-contato">
          <h3>Contato e redes sociais</h3>

          <div className="footer-contato-item">
            <MessageCircle size={20} aria-hidden="true" />
            <span>WhatsApp</span>
          </div>

          <div className="footer-contato-item">
            <svg
              className="footer-instagram-icone"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </div>
        </section>
      </div>

      <div className="footer-direitos">
        <p>
          © {anoAtual} Marsali Tattoo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
