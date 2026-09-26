function Cuidados() {
    return (
        <section className="cuidados">
            <h2>Cuidados</h2>

            <p className="cuidados-introducao">
                Saiba como preparar sua pele antes da tatuagem e cuidar dela durante a cicatrização.
            </p>

            <div className="cuidados-conteudo">
                <article className="">
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
                    <p>
                        Siga os cuidados necessários para uma boa cicatrização.
                    </p>
                </article>
            </div>
        </section>
    )
}

export default Cuidados