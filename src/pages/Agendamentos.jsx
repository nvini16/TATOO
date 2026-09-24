import { Link } from 'react-router-dom';
import IndexadorImagens from '../components/IndexadorImagens';
import { useState } from 'react';

function Agendamento() {
    const [imagens, setImagens] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const nome = formData.get('nome')
            if (!nome) {
                alert('Acho que se esqueceu de colocar seu nome :(')
                return
            }

        const whatsapp = formData.get('whatsapp')
            if (!whatsapp) {
                alert('Informe seu Whatsapp!')
                return
            }

        const descricao = formData.get('descricao')
            if (!descricao?.trim() && imagens.length === 0) {
                alert('Descreva sua tattoo ou envie uma imagem de referência.')
                return
            }
            

        console.log({
            nome,
            whatsapp,
            descricao,
        })
    }

    return (
        <main className="agendamento-page">
            <h1>Agende sua tattoo</h1>

            <div className="agendamento-center">
                <section>
                <h2>Escolha o trabalho</h2>

                <select name="trabalho">
                    <option value="">Selecione um trabalho</option>
                    <option value="tattoo-pequena">Tattoo pequena</option>
                    <option value="tattoo-media">Tattoo média</option>
                    <option value="tattoo-grande">Tattoo grande</option>
                </select>
            </section>

            <section>
                <h2>Escolha o horário</h2>

                <input type="date" name="data" />

                <select name="horario">
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

                <input type="text" name="nome" placeholder="Seu nome" />

                <input type="tel" name="whatsapp" placeholder="Seu WhatsApp" />

                <textarea name="descricao" placeholder="Conte mais sobre sua tattoo"></textarea>

                <div className="agendamento-opcao">
                    <p>Ou nos mande uma imagem de referência</p>
                </div>

                
                <IndexadorImagens onImagensChange={setImagens} />

                <div className="agendamento-acoes">
                <button type="submit">Continuar</button>

                <button type="button">
                <Link
                    to="/"
                    className="agendamento-link"
                >
                    Voltar
                </Link>
                </button>
                </div>
            </form>
            </div>
        </main>
    );
}

export default Agendamento