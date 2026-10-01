import sobre01 from '../assets/sobre/sobre-01.jpg';

function Sobre() {
    return (
        <section className="sobre" id="sobre">
          {/* Abertura da seção  */}
        <div className="sobre-header">
          <p className="sobre-label">
            Sobre a Marsali Tattoo
          </p>

          <h2> 
            Uma história que começou antes da primeira tatuagem e o início de um sonho.
          </h2>

          <div className="sobre-divider"></div>

          <p className="sobre-intro">
          A tatuagem sempre fez parte da vida de Leticia Marsali.
          Influenciada pelo pai, que também era tatuador, ela encontrou
          nesse universo uma forma de transformar sua paixão pela arte
          em profissão.
          </p>
        </div>

        {/* Trajetória */}
        <article className="sobre-bloco sobre-trajetoria">
          <div className="sobre-conteudo">
            <span className="sobre-numero">01</span>

            <h3>
              Do estudo à pele
            </h3>

            <p>
              Em 2021, Leticia começou a estudar tatuagem por conta própria.
            Foram anos de pesquisas, cursos, anotações e aprendizado sobre
            técnicas, estilos, equipamentos e biossegurança.
            </p>

            <p>
              Em julho de 2025, começou a atuar profissionalmente e passou
            a transformar todo esse conhecimento em prática.
            </p>

            <p>
               Desde 2021, Leticia vem construindo sua trajetória na tatuagem,
              passando por estudos, cursos e prática. Em julho de 2025,
              iniciou sua atuação profissional e passou a transformar esse
              conhecimento em experiência na pele de seus clientes.
            </p>

          </div>

          <div className="sobre-imagem">
            <img 
            src={sobre01}
            alt="Leticia Marsali durante sua trajetória como tatuadora"
            />
          </div>
        </article>

        {/* Diferencial */}
        <article className="sobre-bloco sobre-diferencial">
          <div className="sobre-conteudo">
            <span className="sobre-numero">02</span>

            <h3>
              Aqui, você não é apenas um horário.
            </h3>

            <p>
              Para Leticia, tatuar vai além de realizar um desenho.
  Cada atendimento é pensado para oferecer atenção, conforto
  e disponibilidade durante toda a experiência.
            </p>

            <p>
               Cada tatuagem é tratada como algo pessoal: uma oportunidade
  de transformar uma ideia em algo que represente a pessoa
  e a história que ela escolheu carregar na pele.
            </p>
          </div>
        </article>

        {/* Essência */}
        <article className="sobre-bloco sobre-essencia">
          <div className="sobre-conteudo">
            <span className="sobre-numero">03</span>

            <h3>
             Tatuagem com identidade. 
            </h3>

            <p>
              A Marsali Tattoo acredita que uma tatuagem pode representar
            autoestima, poder e identidade.
            </p>

            <div className="sobre-principios">
              <span>Confiança</span>
              <span>Conforto</span>
              <span>Compreensão</span>
            </div>

            <p>
             Especializada em Blackwork e Fine Line, com uma abordagem
  profissional, cuidadosa e autoral.
            </p>
          </div>
        </article>

        
      </section>
    )
}

export default Sobre