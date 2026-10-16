import IndicadorCard from './IndicadorCard';

function AgendamentosConcluidos({ agendamentos, carregando, erro }) {
    let valor = '_';
    let descricao = 'Nenhum dado carregado';

    if (carregando) {
        valor = 'Carregando...';
        descricao = 'Consultando agendamentos...'
    } else if (erro) {
        descricao = erro;
    } else if (Array.isArray(agendamentos)) {
        valor = agendamentos.filter((agendamento) => agendamento.status === 'concluido').length;

        descricao = 'Atendimentos concluídos';
    }

    return (
        <IndicadorCard 
            titulo="Agendamentos concluídos"
            valor={valor}
            descricao={descricao}
        />
    );
}

export default AgendamentosConcluidos;