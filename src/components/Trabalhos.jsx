import trabalho1 from '../assets/trabalhos/otimizadas/trabalho-1.webp';
import trabalho2 from '../assets/trabalhos/otimizadas/trabalho-2.webp';
import trabalho3 from '../assets/trabalhos/otimizadas/trabalho-3.webp';
import trabalho4 from '../assets/trabalhos/otimizadas/trabalho-4.webp';
import trabalho5 from '../assets/trabalhos/otimizadas/trabalho-5.webp';
import trabalho6 from '../assets/trabalhos/otimizadas/trabalho-6.webp';
import trabalho7 from '../assets/trabalhos/otimizadas/trabalho-7.webp';
import trabalho8 from '../assets/trabalhos/otimizadas/trabalho-8.webp';
import trabalho9 from '../assets/trabalhos/otimizadas/trabalho-9.webp'
import trabalho10 from '../assets/trabalhos/otimizadas/trabalho-10.webp'
import trabalho11 from '../assets/trabalhos/otimizadas/trabalho-11.webp'
import trabalho12 from '../assets/trabalhos/otimizadas/trabalho-12.webp'
import trabalho13 from '../assets/trabalhos/otimizadas/trabalho-13.webp'
import trabalho14 from '../assets/trabalhos/otimizadas/trabalho-14.webp'
import ScrollReveal from './ScrollReveal';
import { useState } from 'react';

function Trabalhos() {
  const trabalhos = [
    {
    id: 1,
    imagem: trabalho1,
    categoria: 'Blackwork',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 2,
    imagem: trabalho2,
    categoria: 'Fine Line',
    titulo: 'Tatuagem autoral',
    
    },

    {
    id: 3,
    imagem: trabalho3,
    categoria: 'Cybertribal',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 4,
    imagem: trabalho4,
    categoria: 'Blackwork',
    titulo: 'Tatuagem autoral',
    
    },

    {
    id: 5,
    imagem: trabalho5,
    categoria: 'Blackwork',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 6,
    imagem: trabalho6,
    categoria: 'Fine Line',
    titulo: 'Tatuagem autoral',
    
    },

    {
    id: 7,
    imagem: trabalho7,
    categoria: 'Blackwork',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 8,
    imagem: trabalho8,
    categoria: 'Anime',
    titulo: 'Tatuagem autoral',
    
    },

    {
    id: 9,
    imagem: trabalho9,
    categoria: 'Fine Line',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 10,
    imagem: trabalho10,
    categoria: 'Fine Line',
    titulo: 'Tatuagem autoral',
    
    },

    {
    id: 11,
    imagem: trabalho11,
    categoria: 'Fine Line',
    titulo: 'Tatuagem autoral',
    },

    {
    id: 12,
    imagem: trabalho12,
    categoria: 'Blackwork',
    titulo: 'Tatuagem autoral',
    
    },

    {
      id: 13,
      imagem: trabalho13,
      categoria: 'Anime',
      titulo: 'Tatuagem autoral'
    },

    {
      id: 14,
      imagem: trabalho14,
      categoria: 'Anime',
      titulo: 'Tatuagem autoral'
    }

    
  ]


  const [filtro, setFiltro] = useState('Todos');

  const trabalhosFiltrados = 
    filtro === 'Todos'
      ? trabalhos
      : trabalhos.filter((trabalhos) => trabalhos.categoria === filtro);
  return (
    <section className="trabalhos" id="trabalhos">
      <div className="trabalhos-container">

        <div className="trabalhos-header">
          <ScrollReveal>
            <p className="trabalhos-label">
            Galeria de trabalhos
          </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2>
            Portfólio <span className="font-logo">MT</span>
          </h2>

          <div className="trabalhos-divider"></div>
          </ScrollReveal>
        </div>

      </div>

      <div className="trabalhos-filtros">
        <ScrollReveal className="filtro-reveal">
          <button 
          type="button" 
          className={filtro === 'Todos' ? 'filtro-ativo' : ''}
          onClick={() => setFiltro('Todos')}
        >
          Todos
        </button>
        </ScrollReveal>

        <ScrollReveal className="filtro-reveal">
          <button 
          type="button"
          className={filtro === 'Cybertribal' ? 'filtro-ativo' : ''}
          onClick={() => setFiltro('Cybertribal')}
        > 
          Cybertribal
        </button>
        </ScrollReveal>

        <ScrollReveal className="filtro-reveal">
          <button 
          type="button"
          className={filtro === 'Fine Line' ? 'filtro-ativo' : ''}
          onClick={() => setFiltro('Fine Line')}
        >
          Fine Line
        </button>
        </ScrollReveal>

        <ScrollReveal className="filtro-reveal">
          <button 
          type="button"
          className={filtro === 'Blackwork' ? 'filtro-ativo' : ''}
          onClick={() => setFiltro('Blackwork')}
        >
          Blackwork
        </button>
        </ScrollReveal>

        <ScrollReveal className="filtro-reveal">
          <button 
          type="button"
          className={filtro === 'Anime' ? 'filtro-ativo' : ''}
          onClick={() => setFiltro('Anime')}
        >
          Anime
        </button>
        </ScrollReveal>
      </div>

      <div className="trabalhos-grid">

      {trabalhosFiltrados.map((trabalho) => (
        <ScrollReveal key={trabalho.id}>
          <article className="trabalho-card">
          <div className="trabalhos-imagem">
            <img 
              src={trabalho.imagem}
              alt={`Trabalho de tatuagem ${trabalho.id}`}
            />
          </div>

          <div className="trabalhos-info">
            <span>{trabalho.categoria}</span>

            <h3>{trabalho.titulo}</h3>
          </div>
        </article>
        </ScrollReveal>
      ))}

      </div>
    </section>

  );
}

export default Trabalhos;