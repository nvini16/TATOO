import { Link } from 'react-router-dom';
import logo from '../assets/logo/marsali-tatoo-logo-fundo-none.png';

function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-conteudo">
        <section className="footer-marca">
          <div className="footer-marca-alinhar">
            <img
              src={logo}
              alt="Marsali Tattoo Studio"
              className="footer-logo"
            />

            <h2>Marsali Tattoo</h2>
          </div>
        </section>

        <nav className="footer-navegacao" aria-label="Navegação do rodapé">
          <h3>Navegação</h3>

          <Link to="/#inicio">Início</Link>
          <Link to="/#trabalhos">Galeria de trabalhos</Link>
          <Link to="/#cuidados">Cuidados</Link>
          <Link to="/#sobre">Sobre</Link>
          <Link to="/Agendamento">Agendar horário</Link>
        </nav>

        <section className="footer-contato">
          <h3>Contato e redes sociais</h3>

          <a
            className="footer-contato-item"
            href="https://www.instagram.com/marsalitattoo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Instagram da Marsali Tattoo em uma nova aba"
          >
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
            <span>@marsalitattoo</span>
          </a>
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
