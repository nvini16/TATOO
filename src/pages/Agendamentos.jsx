function Agendamento() {

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <main className="agendamento-page">
            <h1>Agende sua tattoo</h1>

            <div className="agendamento-center">
                <section>
                <h2>Escolha o trabalho</h2>

                <select>
                    <option value="">Selecione um trabalho</option>
                    <option value="tattoo-pequena">Tattoo pequena</option>
                    <option value="tattoo-media">Tattoo média</option>
                    <option value="tattoo-grande">Tattoo grande</option>
                </select>
            </section>

            <section>
                <h2>Escolha o horário</h2>

                <input type="date" />

                <select>
                    <option value="">Selecione um horário</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                </select>
            </section>

            <form onSubmit={handleSubmit}>
                <h2>Seus dados</h2>

                <input type="text" placeholder="Seu nome" />

                <input type="tel" placeholder="Seu WhatsApp" />

                <textarea placeholder="Conte mais sobre sua próxima tattoo"></textarea>


            </form>
                <button type="submit">Continuar</button>
            </div>
        </main>
    );
}

export default Agendamento