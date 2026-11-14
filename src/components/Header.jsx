import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo/marsali-tatoo-logo-fundo-none.png';
import { supabase } from '../lib/supabase';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [authVerificada, setAuthVerificada] = useState(false);
  const location = useLocation();

  const rotaAtual = `${location.pathname}${location.search}${location.hash}`;
  const estadoRetornoLogin = { from: rotaAtual };

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuarioAutenticado(Boolean(session));
        setAuthVerificada(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className={`header ${headerVisible ? 'visible' : 'hidden'}`}>
        <div className="header-brand">
          <a href="/" className="brand" onClick={closeMenu}>
            <img src={logo} alt="Marsali Tattoo Studio" className="brand-logo" />
          </a>
        </div>

        <nav className="header-nav">
          <Link to="/Header.jsx">Início</Link>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#cuidados">Cuidados</a>
          <a href="#sobre">Sobre</a>
        </nav>

        <div className="header-actions">
          {authVerificada && (usuarioAutenticado ? (
            <Link className="header-login" to="/MarsaliUser">
              Meu perfil
            </Link>
          ) : (
            <Link
              className="header-login"
              to="/LoginCliente"
              state={estadoRetornoLogin}
            >
              Entrar
            </Link>
          ))}
          <Link className="header-cta" to="/Agendamento">
            Agendar-se
          </Link>
        </div>
      </header>

      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a className="mobile-menu-a" href="#inicio" onClick={closeMenu}>Inicío</a>
        <a className="mobile-menu-a" href="#trabalhos" onClick={closeMenu}>Trabalhos</a>
        <a className="mobile-menu-a" href="#cuidados" onClick={closeMenu}>Cuidados</a>
        <a className="mobile-menu-a" href="#sobre" onClick={closeMenu}>Sobre</a>

        {authVerificada && (
          usuarioAutenticado ? (
            <Link className="mobile-menu-login" to="/MarsaliUser" onClick={closeMenu}>
              Perfil
            </Link>
          ) : (

            <Link 
              className="mobile-menu-login"
              to="/LoginCliente"
              state={estadoRetornoLogin}
              onClick={closeMenu}
            >
              Entrar
            </Link>
          )
        )}

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
