import Header from '../components/Header';
import Hero from '../components/Hero';

function Home() {
    return (
    <main>
      <Header />

      <Hero />

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