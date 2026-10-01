import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo/marsali-tatoo-logo-fundo-none.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
    useEffect(() => {
      let lastScrollY = window.scrollY;

      function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }

        lastScrollY = currentScrollY;
      }

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    useEffect(() => {
  document.body.classList.toggle('header-hidden', !headerVisible);

  return () => {
    document.body.classList.remove('header-hidden');
  };
}, [headerVisible]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
    <header className={`header ${headerVisible ? 'visible' : 'hidden'}`}>
      <div className="header-brand">
        <a href="/" className="brand" onClick={closeMenu}>
          <img src={logo} alt="Marsali Tattoo Studio" className="brand-logo" />
        </a>
      </div>

      <nav className="header-nav">
        <a href="#inicio">Início</a>
        <a href="#trabalhos">Trabalhos</a>
        <a href="#cuidados">Cuidados</a>
        <a href="#sobre">Sobre</a>
      </nav> 

      <Link className="header-cta" to="/Agendamento">
        Agendar-se
      </Link>

      


    </header>

     <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a className="mobile-menu-a" href="#inicio" onClick={closeMenu}>Inicío</a>
        <a className="mobile-menu-a" href="#trabalhos" onClick={closeMenu}>Trabalhos</a>
        <a className="mobile-menu-a" href="#cuidados" onClick={closeMenu}>Cuidados</a>
        <a className="mobile-menu-a" href="#sobre" onClick={closeMenu}>Sobre</a>

          <Link 
            className="mobile-menu-cta"
            to="/Agendamento"
            onClick={closeMenu}
          >
            Agendar-se
          </Link>
      </nav>

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

     

    </>

  );
}

export default Header;
