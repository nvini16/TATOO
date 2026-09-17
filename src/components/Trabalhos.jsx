import trabalho1 from '../assets/trabalhos/trabalho-1.jpg';
import trabalho2 from '../assets/trabalhos/trabalho-2.jpg';
import trabalho3 from '../assets/trabalhos/trabalho-3.jpg';
import trabalho4 from '../assets/trabalhos/trabalho-4.jpg';
import trabalho5 from '../assets/trabalhos/trabalho-5.jpg';
import trabalho6 from '../assets/trabalhos/trabalho-6.webp';
import trabalho7 from '../assets/trabalhos/trabalho-7.jpg';
import trabalho8 from '../assets/trabalhos/trabalho-8.jpg';
import trabalho9 from '../assets/trabalhos/trabalho-9.jpg'
import trabalho10 from '../assets/trabalhos/trabalho-10.jpg'
import trabalho11 from '../assets/trabalhos/trabalho-11.jpg'
import trabalho12 from '../assets/trabalhos/trabalho-12.jpg'

function Trabalhos() {
  return (
    <section className="trabalhos" id="trabalhos">
      <div className="trabalhos-container">

        <div className="trabalhos-header">
          <p className="trabalhos-label">
            Galeria de trabalhos
          </p>

          <h2>
            Portifólio
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
            <span>Blackwork</span>

            <h3>1</h3>
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
            <h3>2</h3>
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
            <span>Cybertribal</span>
            <h3>3</h3>
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
            <h3>4</h3>
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
            <span>Blackwork</span>
            <h3>5</h3>
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
            <span>Fine Line | Autoral</span>
            <h3>6</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho7}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>7</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho8}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>8</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho9}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>9</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho10}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>10</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho11}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>11</h3>
          </div>
        </article>

        <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho12}
              alt="Trabalho de tatuagem"
            />
          </div>

          <div className="trabalhos-info">
            <span>Blackwork | Autoral</span>
            <h3>12</h3>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Trabalhos;