import IndicadorCard from './IndicadorCard';

function AgendamentosFaltou({ agendamentos, carregando, erro }) {
    let valor = '_';
    let descricao = 'Nenhum dado carregado';

    if (carregando) {
        valor = 'Carregando...';
        descricao = 'Consultando agendamentos...';
    } else if (erro) {
        descricao = erro;
    } else if (Array.isArray(agendamentos)) {
        valor = agendamentos.filter((agendamentos) => agendamentos.status === 'faltou').length;

        descricao = 'Registros de faltas';
    }

    return (
        <IndicadorCard 
            titulo="Faltas"
            valor={valor}
            descricao={descricao}
        />
    );
}

export default AgendamentosFaltou;