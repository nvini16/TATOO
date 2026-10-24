import Header from '../components/Header';
import Hero from '../components/Hero';
import Trabalhos from '../components/Trabalhos';
import Sobre from '../components/Sobre';
import Cuidados from '../components/Cuidados';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <main>
      <Header />
      
      <Hero />
      
      <Trabalhos />
      
      <Cuidados />
      
      <Sobre />
      
      <Footer />
      
    </main>
  );
}

export default Home;
