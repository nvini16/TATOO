import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">MARSALI</span>
          <span className="brand-subtitle">TATTOO STUDIO</span>
        </Link>
      </div>

      <nav className="header-nav">
        <a href="#inicio">Início</a>
        <a href="#trabalhos">Trabalhos</a>
        <a href="#sobre">Sobre</a>
      </nav>

      <Link className="header-cta" to="/Agendamento">
        Agendar horário
      </Link>

      <button 
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#inicio" onClick={closeMenu}>Inicío</a>
        <a href="#trabalhos" onClick={closeMenu}>Trabalhos</a>
        <a href="#sobre" onClick={closeMenu}>Sobre</a>

          <Link 
            className="mobile-menu-cta"
            to="/Agendamento"
            onClick={closeMenu}
          >
            Agendar horário
          </Link>
      </nav>

    </header>
  );
}

export default Header;
