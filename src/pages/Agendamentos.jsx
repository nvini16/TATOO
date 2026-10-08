import { Link } from 'react-router-dom';
import IndexadorImagens from '../components/IndexadorImagens';
import { useState } from 'react';
import CalendarioAgendamento from '../components/CalendarioAgendamento';
import Alert from '../components/Alert';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || '';


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

    const handleSubmit = async (event) => {
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

        const estilo = formData.get('estilo')
            if (!estilo) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Estilo não selecionado!',
                    mensagem: 'Escolha o estilo da sua tattoo.'
                });
                return;
            }

        const localCorpo = formData.get('local_corpo')
            if (!localCorpo) {
                setAlerta({
                    mostrar: true,
                    tipo: 'aviso',
                    titulo: 'Local não selecionado!',
                    mensagem: 'Escolha o local do corpo ara sua tattoo.'
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

        const formDataAgendamento = new FormData();

        formDataAgendamento.append('nome', nome);
        formDataAgendamento.append('whatsapp', whatsapp);
        formDataAgendamento.append('trabalho', trabalho);
        formDataAgendamento.append('estilo', estilo);
        formDataAgendamento.append('local_corpo');
        formDataAgendamento.append('descricao', descricao);
        formDataAgendamento.append('data', data);
        formDataAgendamento.append('horario', horario); 

        imagens.forEach((imagem) => {
            formDataAgendamento.append('imagens', imagem.arquivo);
        });

        try {
            const resposta = await fetch(`${API_URL}/api/agendamentos`, {
                method: 'POST',
                body: formDataAgendamento,
            });

            const textoResposta = await resposta.text();

            console.log('Status:', resposta.status);
            console.log('Resposta do backend', textoResposta);

            if (resposta.status === 201) {
                setAlerta({
                    mostrar: true,
                    tipo: 'sucesso',
                    titulo: 'Agendamento enviado.',
                    mensagem: 'Sua solicitação foi recebida com sucesso.'
                });
            } else if (resposta.status === 409) {
                setAlerta({
                    mostrar: true,
                    tipo: 'erro',
                    titulo: 'Data indisponível.',
                    mensagem: 'Já existe um agendamento ativo para essa data. Escolha outro dia.'
                });
            } else {
                setAlerta({
                    mostrar: true,
                    tipo: 'erro',
                    titulo: 'Erro no agendamento.',
                    mensagem: 'Não foi possível realizar o agendamento. Tente novamente.'
                });
            }


        } catch (erro) {
            console.error('Erro ao enviar agendamento! Tente novamente mais tarde:', erro);
        }

        
    }

    return (

        
        <main className="agendamento-page">
            
            {alerta.mostrar && (
                <Alert 
                    key={`${alerta.titulo}-${alerta.mensagem}`}
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

                 <ScrollReveal>
                <h1>Agende sua tattoo</h1>
            </ScrollReveal>
           <div className="agendamento-contain">


            <div className="agendamento-center">
                <section>
                <ScrollReveal>
                    <h2>Escolha o trabalho</h2>
                </ScrollReveal>

                <ScrollReveal>
                    <select name="trabalho" form="agendamento-form">
                        <option value="">Selecione um trabalho</option>
                        <option value="tattoo-pequena">Tattoo pequena</option>
                        <option value="tattoo-media">Tattoo média</option>
                        <option value="tattoo-grande">Tattoo grande</option>
                </select>
                </ScrollReveal>

                <ScrollReveal>
                    <select name="estilo" form="agendamento-form">
                        <option value="">Selecione um estilo</option>
                        <option value="minimalista">Minimalista</option>
                        <option value="fine-line">Fine Line</option>
                        <option value="lettering">Lettering</option>
                        <option value="old-school">Old School</option>
                        <option value="blackwork-simples">Blackwork Simples</option>
                        <option value="blackwork-detalhado">Blackwork Detalhado</option>
                        <option value="blackwork-pesado">Blackwork Pesado</option>
                        <option value="ornamental">Ornamental</option>
                        <option value="pontilhismo">Pontilhismo</option>
                        <option value="black-grey">Black & Grey</option>
                        <option value="realismo-pb">Realismo P&B</option>
                        <option value="colorida">Colorida</option>
                        <option value="autoral-exclusiva">Autoral Exclusiva</option>
                        <option value="cover-up">Cover-up</option>
                    </select>
                </ScrollReveal>

                <ScrollReveal>
                    <h2>Escolha o local da tattoo</h2>
                </ScrollReveal>

                <ScrollReveal>
                    <select name="local_corpo" form="agendamento-form">
                        <option value="">Selecione o local</option>
                        <option value="braco">Braço</option>
                        <option value="antebraco">Antebraço</option>
                        <option value="biceps">Bíceps</option>
                        <option value="triceps">Tríceps</option>
                        <option value="ombro">Ombro</option>
                        <option value="peito">Peito</option>
                        <option value="costas">Costas</option>
                        <option value="abdomen">Abdomen</option>
                        <option value="costela">Costela</option>
                        <option value="coxa">Coxa</option>
                        <option value="panturrilha">Panturrilha</option>
                        <option value="joelho">Joelho</option>
                        <option value="cotovelo">Cotovelo</option>
                        <option value="mao">Mão</option>
                        <option value="pe">Pé</option>
                        <option value="pescoco">Pescoço</option>
                        <option value="cabeca-rosto">Cabeça/Rosto</option>
                    </select>
                </ScrollReveal>
            </section>

            <section> 
                <ScrollReveal>
                    <h2>Escolha o horário</h2>
                </ScrollReveal>


                <ScrollReveal>
                    <select name="horario" form="agendamento-form">
                        <option value="">Selecione um horário</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                    </select>
                </ScrollReveal>

           <ScrollReveal>
             <CalendarioAgendamento 
                dataSelecionada={dataSelecionada}
                onSelecionarData={setDataSelecionada}
            />
           </ScrollReveal>


            </section>

            <form id="agendamento-form" onSubmit={handleSubmit}>
                <ScrollReveal>
                    <h2>Seus dados</h2>
                </ScrollReveal>

               <ScrollReveal>
                 <input type="text" name="nome" placeholder="Seu nome" />
               </ScrollReveal>

               <ScrollReveal>
                 <input type="tel" name="whatsapp" placeholder="Seu WhatsApp" />
               </ScrollReveal>

                <ScrollReveal>
                    <textarea name="descricao" placeholder="Descreva sua ideia"></textarea>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="agendamento-opcao">
                    <p>Ou nos mande uma imagem de referência.</p>
                </div>
                </ScrollReveal>

                
                <ScrollReveal>
                    <IndexadorImagens onImagensChange={setImagens} />
                </ScrollReveal>

                <div className="agendamento-acoes">
                <ScrollReveal>
                    <button type="submit">Agendar</button>
                </ScrollReveal>

               <ScrollReveal>
                 <Link
                    to="/"
                    className="agendamento-link"
                >
                    Voltar
                </Link>
               </ScrollReveal>
                </div>
            </form>
            </div>
           </div>
        </main>
    );
}

export default Agendamento