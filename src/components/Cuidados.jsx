function Cuidados() {
    return (
        <section className="cuidados">
            <h2>Cuidados</h2>

            <p className="cuidados-introducao">
                Saiba como preparar sua pele antes da tatuagem e cuidar dela durante a cicatrização.
            </p>

            <div className="cuidados-conteudo">
                <article className="cuidados-card">
                    <h3>Antes da tatuagem</h3>
                    
                    <ul>
                        <li>Durma bem na noite anterior.</li>
                        <li>Alimente-se antes do procedimento.</li>
                        <li>Beba bastante água.</li>
                        <li>Evite consumir álcool antes da sessão.</li>
                        <li>Não aplique cremes ou produtos irritantes na região.</li>
                    </ul>
                </article>

                <article className="cuidados-card">
                    <h3>Depois da tatuagem</h3>
                    
                    <ul>
                        <li>Higienize a região conforme a orientação da tatuadora.</li>
                        <li>Evite coçar ou remover as casquinhas.</li>
                        <li>Não exponha a tatuagem ao sol durante a cicatrização.</li>
                        <li>Evite piscina, mar e banhos muitos prolongados.</li>
                        <li>Mantenha a região hidratada conforme orientação profissinal.</li>
                    </ul>
                </article>
            </div>
        </section>
    )
}

export default Cuidados