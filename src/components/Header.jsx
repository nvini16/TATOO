import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
        <div>
          <strong className="brand">TATOO</strong>
        </div>

        <nav>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#sobre">Sobre</a>

          <Link className="login-link" to="/Login">
            Login
          </Link>

        </nav>
      </header>
    )
}

export default Header