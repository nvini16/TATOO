import Header from '../components/Header';
import Hero from '../components/Hero';
import Trabalhos from '../components/Trabalhos';

function Home() {
    return (
    <main>
      <Header />

      <Hero />

      <Trabalhos />

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