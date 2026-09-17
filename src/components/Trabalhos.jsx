import trabalho1 from '../assets/trabalhos/trabalho-1.png';
import trabalho2 from '../assets/trabalhos/trabalho-2.jpg';
import trabalho3 from '../assets/trabalhos/trabalho-3.jpg';
import trabalho4 from '../assets/trabalhos/trabalho-4.jpg';
import trabalho5 from '../assets/trabalhos/trabalho-5.jpg';
import trabalho6 from '../assets/trabalhos/trabalho-6.webp';

function Trabalhos() {
  return (
    <section className="trabalhos" id="trabalhos">
      <div className="trabalhos-container">

        <div className="trabalhos-header">
          <p className="trabalhos-label">
            Galeria de trabalhos
          </p>

          <h2>
            Portifólio Autoral
          </h2>

          <div className="trabalhos-divider"></div>
        </div>

      </div>

      <div className="trabalhos-filtros">
        <button type="button" className="filtro-ativo">
          Todos
        </button>

        <button type="button">
          Preto e Cinza
        </button>

        <button type="button">
          Fine Line
        </button>

        <button type="button">
          Blackword
        </button>

      </div>

      <div className="trabalhos-grid">
        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho1}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Preto e Cinza</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho2}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Preto e Cinza</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho3}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Fine Line</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho4}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho5}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Preto e Cinza</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho6}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Fine Line</span>
            <h3>Tatuagem autoral</h3>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Trabalhos;