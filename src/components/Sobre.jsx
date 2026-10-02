import sobre01 from '../assets/sobre/sobre-01.jpg';
import ScrollReveal from './ScrollReveal';


function Sobre() {
    return (
        <section className="sobre" id="sobre">
          {/* Abertura da seção  */}
        <div className="sobre-header">
          <ScrollReveal>
            <p className="sobre-label">
            Sobre a Marsali Tattoo
          </p>
          </ScrollReveal>

         <ScrollReveal>
             <h2> 
            Uma história que começou antes da primeira tatuagem e o início de um sonho.
          </h2>

          <div className="sobre-divider"></div>
         </ScrollReveal>

          <ScrollReveal>
            <p className="sobre-intro">
          A tatuagem sempre fez parte da vida de Leticia Marsali.
          Influenciada pelo pai, que também era tatuador, ela encontrou
          nesse universo uma forma de transformar sua paixão pela arte
          em profissão.
          </p>
          </ScrollReveal>
        </div>

        {/* Trajetória */}
       <div className="fundo">
           <ScrollReveal>
          <article className="sobre-bloco sobre-trajetoria">
          <div className="sobre-conteudo">
            <ScrollReveal>
              <span className="sobre-numero">01</span>
            </ScrollReveal>

           <ScrollReveal>
             <h3>
              Do estudo à pele
            </h3>
           </ScrollReveal>

            <ScrollReveal>
              <p>
              Em 2021, Leticia começou a estudar tatuagem por conta própria.
            Foram anos de pesquisas, cursos, anotações e aprendizado sobre
            técnicas, estilos, equipamentos e biossegurança.
            </p>
            </ScrollReveal>

            <ScrollReveal>
              <p>
              Em julho de 2025, começou a atuar profissionalmente e passou
            a transformar todo esse conhecimento em prática.
            </p>
            </ScrollReveal>

            <ScrollReveal>
              <p>
               Desde 2021, Leticia vem construindo sua trajetória na tatuagem,
              passando por estudos, cursos e prática. Em julho de 2025,
              iniciou sua atuação profissional e passou a transformar esse
              conhecimento em experiência na pele de seus clientes.
            </p>
            </ScrollReveal>

          </div>

          <div className="sobre-imagem">
           <ScrollReveal>
             <img 
            src={sobre01}
            alt="Leticia Marsali durante sua trajetória como tatuadora"
            />
           </ScrollReveal>
          </div>
        </article>
        </ScrollReveal>

        {/* Diferencial */}
        <article className="sobre-bloco sobre-diferencial">
          <div className="sobre-conteudo">
            <ScrollReveal>
              <span className="sobre-numero">02</span>
            </ScrollReveal>

            <ScrollReveal>
              <h3>
              Aqui, você não é apenas um horário.
            </h3>
            </ScrollReveal>

            <ScrollReveal>
              <p>
              Para Leticia, tatuar vai além de realizar um desenho.
  Cada atendimento é pensado para oferecer atenção, conforto
  e disponibilidade durante toda a experiência.
            </p>
            </ScrollReveal>

            <ScrollReveal>
              <p>
               Cada tatuagem é tratada como algo pessoal: uma oportunidade
  de transformar uma ideia em algo que represente a pessoa
  e a história que ela escolheu carregar na pele.
            </p>
            </ScrollReveal>
          </div>
        </article>

        {/* Essência */}
        <article className="sobre-bloco sobre-essencia">
          <div className="sobre-conteudo">
            <ScrollReveal>
              <span className="sobre-numero">03</span>
            </ScrollReveal>

           <ScrollReveal>
             <h3>
             Tatuagem com identidade. 
            </h3>
           </ScrollReveal>

           <ScrollReveal>
             <p>
              A Marsali Tattoo acredita que uma tatuagem pode representar
            autoestima, poder e identidade.
            </p>
           </ScrollReveal>

            <div className="sobre-principios">
              <ScrollReveal>
                <span>Confiança</span>
              </ScrollReveal>

              <ScrollReveal>
                <span>Conforto</span>
              </ScrollReveal>

              <ScrollReveal>
                <span>Compreensão</span>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <p>
             Especializada em Blackwork e Fine Line, com uma abordagem
  profissional, cuidadosa e autoral.
            </p>
            </ScrollReveal>
          </div>
        </article>

       </div>
        
      </section>
    )
}

export default Sobre