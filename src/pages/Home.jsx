import Header from '../components/Header';

function Home() {
    return (
    <main>
      <Header />

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

        <h2>Arte. Precisão. Identidade.</h2>
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

      <section id="sobre">
        <div className="section-heading">
          <p>Sobre nós</p>

          <h2>Mais do que tatuagem.</h2>
        </div>

        <p>
          Um espaço edicado à arte, identidade e expressão através da tatuagem.
        </p>
      </section>

    </main>
  )
}

export default Home