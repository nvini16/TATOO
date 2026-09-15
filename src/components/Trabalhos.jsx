import { useEffect, useRef, useState } from 'react';

import arte from '../assets/trabalhos/arte.jpg';
import precisao from '../assets/trabalhos/precisao.jpg';
import identidade from '../assets/trabalhos/identidade.jpg';

function Trabalhos() {

  
  const galleryRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
  const gallery = galleryRef.current;

  if (isPaused) {
    return;
  }

  const interval = setInterval(() => {
    const cardWidth = gallery.firstElementChild.offsetWidth;
    const gap = 24;
    const step = cardWidth + gap;

    const reachedEnd =
      gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - step;

    if (reachedEnd) {
      gallery.scrollTo({
        left: 0,
        behavior: 'smooth',
      });

      return;
    }

    gallery.scrollBy({
      left: step,
      behavior: 'smooth',
    });
  }, 3000);

  return () => clearInterval(interval);
}, [isPaused]);

  return (
    <section className="trabalhos" id="trabalhos">

      <header className="trabalhos-header">
        <p>Nosso trabalho</p>

        <h2>Arte. Precisão. Identidade.</h2>
      </header>

      <div className="trabalhos-gallery-container">

        <div 
        className="trabalhos-gallery"
        ref={galleryRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >

        <article className="trabalho-card">
          <img
            src={arte}
            alt="Tatuagem de arte"
          />

          <h3>Arte</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={arte}
            alt="Tatuagem de arte"
          />

          <h3>Arte</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={arte}
            alt="Tatuagem de arte"
          />

          <h3>Arte</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={arte}
            alt="Tatuagem de arte"
          />

          <h3>Arte</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={arte}
            alt="Tatuagem de arte"
          />

          <h3>Arte</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={precisao}
            alt="Tatuagem de precisão"
          />

          <h3>Precisão</h3>
        </article>

        <article className="trabalho-card">
          <img
            src={identidade}
            alt="Tatuagem de identidade"
          />

          <h3>Identidade</h3>
        </article>

        </div>
        
      </div>

    </section>
  )
}

export default Trabalhos