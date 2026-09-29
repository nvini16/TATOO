import { Link } from 'react-router-dom';
import IndexadorImagens from '../components/IndexadorImagens';
import { useState } from 'react';
import CalendarioAgendamento from '../components/CalendarioAgendamento';
import Alert from '../components/Alert';

function Agendamento() {

    const [imagens, setImagens] = useState([])
    const [dataSelecionada, setDataSelecionada] = useState();
    const [ alerta, setAlerta] = useState(
        {
            mostrar: false,
            tipo: 'info',
            titulo: '',
            mensagem: ''
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const nome = formData.get('nome')
            if (!nome) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Nome não informado!',
                    mensagem: 'Informe seu nome antes de continuar.'
                });
                return;
            }

        const whatsapp = formData.get('whatsapp')
            if (!whatsapp) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'WhatsApp não informado!',
                    mensagem: 'Informe seu WhatsApp antes de continuar.'
                });
                return;
            }

        const descricao = formData.get('descricao')
            if (!descricao?.trim() && imagens.length === 0) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Referência não informada!',
                    mensagem: 'Descreva sua tattoo ou envie uma imagem de referência'
                });
                return;
            }

        const trabalho = formData.get('trabalho')
            if (!trabalho) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Trabalho não selecionado!',
                    mensagem: 'Escolha o tipo de trabalho da sua tattoo.'
                });
                return;

            }
        const data = dataSelecionada
            ? dataSelecionada.toLocaleDateString('en-CA')
            : ''

            if (!data) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Data não selecionada!',
                    mensagem: 'Escolha uma data para sua tattoo.'
                });
                return;
            }

        const agora = new Date();
        const hoje = [
            agora.getFullYear(),
            String(agora.getMonth() + 1).padStart(2, '0'),
            String(agora.getDate()).padStart(2, '0')
        ].join('-');
                if (data < hoje) {
                    setAlerta({
                        mostrar: true,
                        tipo: 'aviso',
                        titulo: 'Data não Inválida!',
                        mensagem: 'Escolha uma data válida para sua tattoo.'
                    });
                    return;
                }
        const horario = formData.get('horario')
            if (!horario) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Horário não selecionado!',
                    mensagem: 'Escolha um horário para sua tattoo.'
                })
                return
            }

            const dataAtual = [
                agora.getFullYear(),
                String(agora.getMonth() + 1).padStart(2, '0'),
                String(agora.getDate()).padStart(2, '0')
            ].join('-');
            const horaAtual = agora.toTimeString().slice(0, 5)
                if (data === dataAtual && horario <= horaAtual) {
                    setAlerta({
                        mostrar: true,
                        tipo: 'aviso',
                        titulo: 'Horário inválido!',
                        mensagem: 'Escolha um horário posterior ao horário atual.'
                    });
                    return;
                    
                }            

        const agendamento = { 
            nome,
            whatsapp,
            descricao,
            trabalho,
            data,
            horario
        }

        console.log(agendamento)

        setAlerta({
            mostrar: true,
            tipo: 'sucesso',
            titulo: 'Solicitação recebida.',
            mensagem: 'Seus dados foram preenchidos corretamente.'
        })
    }

    return (

        
        <main className="agendamento-page">
            
            {alerta.mostrar && (
                <Alert 
                    tipo={alerta.tipo}
                    titulo={alerta.titulo}
                    mensagem={alerta.mensagem}
                    fechar={() => 
                        setAlerta((alertaAtual) => ({
                            ...alertaAtual,
                            mostrar: false
                        }))
                    }
                /> 
        )}

            <h1>Agende sua tattoo</h1>

            <CalendarioAgendamento 
                dataSelecionada={dataSelecionada}
                onSelecionarData={setDataSelecionada}
            />

            <div className="agendamento-center">
                <section>
                <h2>Escolha o trabalho</h2>

                <select name="trabalho" form="agendamento-form">
                    <option value="">Selecione um trabalho</option>
                    <option value="tattoo-pequena">Tattoo pequena</option>
                    <option value="tattoo-media">Tattoo média</option>
                    <option value="tattoo-grande">Tattoo grande</option>
                </select>
            </section>

            <section>
                <h2>Escolha o horário</h2>


                <select name="horario" form="agendamento-form">
                    <option value="">Selecione um horário</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                </select>
            </section>

            <form id="agendamento-form" onSubmit={handleSubmit}>
                <h2>Seus dados</h2>

                <input type="text" name="nome" placeholder="Seu nome" />

                <input type="tel" name="whatsapp" placeholder="Seu WhatsApp" />

                <textarea name="descricao" placeholder="Conte mais sobre sua tattoo"></textarea>

                <div className="agendamento-opcao">
                    <p>Ou</p>
                    <p>nos mande uma imagem de referência.</p>
                </div>

                
                <IndexadorImagens onImagensChange={setImagens} />

                <div className="agendamento-acoes">
                <button type="submit">Agendar</button>

                <Link
                    to="/"
                    className="agendamento-link"
                >
                    Voltar
                </Link>
                </div>
            </form>
            </div>
        </main>
    );
}

export default Agendamento