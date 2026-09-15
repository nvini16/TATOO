import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" className="brand">
          <span className="brand-name">MARSALI</span>
          <span className="brand-subtitle">TATTOO STAUDIO</span>
        </Link>
      </div>

      <nav className="header-nav">
        <a href="#inicio">Inicío</a>
        <a href="#trabalhos">Trabalhos</a>
        <a href="#sobre">Sobre</a>
      </nav>

      <Link className="header-cta" to="/Agendamento">
        Agendar horário
      </Link>

    </header>
  );
}

export default Header;
