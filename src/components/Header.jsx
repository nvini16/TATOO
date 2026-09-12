function Header() {
    return (
        <header className="header">
        <div>
          <strong className="brand">TATOO</strong>
        </div>

        <nav>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#sobre">Sobre</a>

          <a className="login-link" href="#login">
            Login
          </a>

        </nav>
      </header>
    )
}

export default Header