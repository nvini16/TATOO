import IndicadorCard from './IndicadorCard';

function AgendamentosCancelados({ agendamentos, carregando, erro }) {
    let valor = '_';
    let descricao = 'Nenhum dado carregado';

    if (carregando) {
        valor = 'Carregando...'
        descricao = 'Consultando agendamentos...';

    } else if (erro) {
        descricao = erro;

    } else if (Array.isArray(agendamentos)) {
        valor = agendamentos.filter((agendamento) => agendamento.status === 'cancelado').length;
        descricao = 'Agendamentos cancelados';
    }

    return (
        <IndicadorCard 
            titulo="Agendamentos cancelados"
            valor={valor}
            descricao={descricao}
        />
    );
}

export default AgendamentosCancelados;