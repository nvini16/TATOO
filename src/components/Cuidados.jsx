import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import cuidado3857 from '../assets/cuidados/3857.webp';
import cuidado3858 from '../assets/cuidados/3858.webp';
import cuidado3859 from '../assets/cuidados/3859.webp';
import cuidado3860 from '../assets/cuidados/3860.webp';
import cuidado3861 from '../assets/cuidados/3861.webp';
import cuidado3862 from '../assets/cuidados/3862.webp';
import cuidado3863 from '../assets/cuidados/3863.webp';
import cuidado3865 from '../assets/cuidados/3865.webp';
import cuidado3867 from '../assets/cuidados/3867.webp';
import cuidado3868 from '../assets/cuidados/3868.webp';

function Cuidados() {
    const [itemAberto, setItemAberto] = useState(null)
    return (
        <section className="cuidados" id="cuidados">
            <ScrollReveal>
                <h2>Cuidados</h2>

                <div className="trabalhos-divider"></div>
            </ScrollReveal>

            <ScrollReveal>
                <p className="cuidados-introducao">
                Saiba como preparar sua pele antes da tatuagem e cuidar dela durante a cicatrização.
                </p>
            </ScrollReveal>

            <div className="cuidados-conteudo">
                <article className="cuidados-card">
                    <ScrollReveal>
                        <h3>Antes da tatuagem</h3>
                    </ScrollReveal>
                    
                    <ul>
                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-esquerda">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 0 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 0 ? null : 0)}
                            >
                                Durma bem na noite anterior.
                                <span>{itemAberto === 0 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 0 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Uma boa noite de sono ajuda seu corpo a estar preparado
                                    para o procedimento.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3860} alt="Pessoa descansando antes da tatuagem" loading="lazy" />
                                </div>
                            </div>
                        )}
                        </li>

                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-esquerda">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 1 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 1 ? null : 1)}
                            >
                                Alimente-se antes do procedimento.
                                <span>{itemAberto === 1 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 1 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Uma alimentação adequada ajuda a manter seu corpo preparado
                                    durante a sessão.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3857} alt="Alimentação antes do procedimento" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-esquerda">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 2 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 2 ? null : 2)}
                            >
                                Beba bastante água.
                                <span>{itemAberto === 2 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 2 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Uma alimentação adequada ajuda a manter seu corpo preparado
                                    durante a sessão.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3858} alt="Pessoa bebendo água" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-esquerda">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 3 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 3 ? null : 3)}
                            >
                                Evite consumir álcool antes da sessão.
                                <span>{itemAberto === 3 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 3 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Evitar o consumo de ácool antes da sessão ajuda a preparar
                                    melhor o corpo para o procedimento.
                                </p>

                            <div className="cuidado-item-imagem">
                                <img src={cuidado3859} alt="Evitar álcool antes da sessão" loading="lazy" />
                            </div>
                        </div>
                            )}

                        </li>

                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-esquerda">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 4 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 4 ? null : 4)}
                            >
                                Não aplique cremes ou produtos irritantes na região.
                                <span>{itemAberto === 4 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 4 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Evite produtos que podem irritar ou sensibilizar a pele
                                    antes da tatuagem.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3861} alt="Cuidados com produtos aplicados na pele antes da tatuagem" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>
                    </ul>
                </article>

                <article className="cuidados-card">
                    <ScrollReveal>
                        <h3>Depois da tatuagem</h3>
                    </ScrollReveal>
                    
                    <ul>
                        <li className="cuidado-item">
                           <ScrollReveal className="cuidado-reveal cuidado-reveal-direita">
                                 <button 
                                className={`cuidado-item-titulo ${itemAberto === 5 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 5 ? null : 5)}
                            >
                                Higienize a região conforme a orientação da tatuadora.
                                <span>{itemAberto === 5 ? '-' : '+'}</span>
                            </button>
                           </ScrollReveal>

                            {itemAberto === 5 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Mantenha a região limpa seguindo corretamente as orientações
                                    recebidas após o procedimento.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3862} alt="Higienização da tatuagem" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li className="cuidado-item">
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-direita">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 6 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 6 ? null : 6)}
                            >
                                Evite coçar ou remover as casquinhas.
                                <span>{itemAberto === 6 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 6 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Durante a cicatrização, evite manipular a pele para não
                                    prejudicar o processo de recuperação da tatuagem.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3863} alt="Evitar coçar a tatuagem durante a cicatrização" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li className="cuidado-item">
                           <ScrollReveal className="cuidado-reveal cuidado-reveal-direita">
                                 <button 
                                className={`cuidado-item-titulo ${itemAberto === 7 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 7 ? null : 7)}
                            >
                                Não exponha a tatuagem ao sol durante a cicatrização.
                                <span>{itemAberto === 7 ? '-' : '+'}</span>
                            </button>
                           </ScrollReveal>

                            {itemAberto === 7 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Proteja a região da exposição solar enquanto a tatuagem
                                    estiver em processo de cicatrização.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3865} alt="Proteção da tatuagem contra o sol" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li className="cuidado-item">
                           <ScrollReveal className="cuidado-reveal cuidado-reveal-direita">
                                 <button 
                                className={`cuidado-item-titulo ${itemAberto === 8 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 8 ? null : 8)}
                            >
                                Evite piscina, mar e banhos muito prolongados.
                                <span>{itemAberto === 8 ? '-' : '+'}</span>
                            </button>
                           </ScrollReveal>

                            {itemAberto === 8 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Evite situações que deixe a tatuagem submersa ou exposta
                                    à água por períodos prolongados durante a cicatrização.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3867} alt="Evitar piscina e mar durante a cicatrização" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>

                        <li 
                            className="cuidado-item"
                        >
                            <ScrollReveal className="cuidado-reveal cuidado-reveal-direita">
                                <button 
                                className={`cuidado-item-titulo ${itemAberto === 9 ? 'aberto' : ''}`}
                                onClick={() => setItemAberto(itemAberto === 9 ? null : 9)}
                            >
                                Mantenha a região hidratada conforme orientação profissional.
                                <span>{itemAberto === 9 ? '-' : '+'}</span>
                            </button>
                            </ScrollReveal>

                            {itemAberto === 9 && (
                                <div className="cuidado-item-conteudo">
                                <p>
                                    Utilize o produto recomendado pela profissional e siga
                                    corretamente as orientações de hidratação.
                                </p>

                                <div className="cuidado-item-imagem">
                                    <img src={cuidado3868} alt="Hidratação da tatuagem conforme orientação profissional" loading="lazy" />
                                </div>
                            </div>
                            )}
                        </li>
                    </ul>
                </article> 
            </div>
        </section>
    )
}

export default Cuidados