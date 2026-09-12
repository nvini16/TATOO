function App() {
  return (
    <main>
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

      <section className="hero" id="inicio">
        <div className="hero-content">
          <p className="hero-label">ESTÚDIO DE TATUAGEM</p>

        <h1>
          Tatuagem não é só
          <br />
          uma marca.
        </h1>

        <h2>É uma história na pele.</h2>
        <p>
          Arte, identidade e experiências personalizadas
          para transformar ideias em tatuagens.
        </p>

        <button type="button">
          Agendar horário
        </button>
        </div>
      </section>

      <section id="trabalhos">
        <div className="section-heading">
          <p>Nosso trabalho</p>

        <h2>Arte. Precisão. Indentidade.</h2>
        </div>

        <div>
          <h3>Arte</h3>

          <p>
            Projetos pensados para cada pessoa.
          </p>
        </div>

        <div>
          <h3>Precisão</h3>

          <p>
            Técnica e atenção em cada detalhe.
          </p>
        </div>

        <div>
          <h3>Identidade</h3>

          <p>
            Uma tatuagem que representa você.
          </p>
        </div>
      </section>

    </main>
  )
}

export default App