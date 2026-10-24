import Header from '../components/Header';
import Hero from '../components/Hero';
import Trabalhos from '../components/Trabalhos';
import Sobre from '../components/Sobre';
import Cuidados from '../components/Cuidados';
import Footer from '../components/Footer';

function Home() {
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
