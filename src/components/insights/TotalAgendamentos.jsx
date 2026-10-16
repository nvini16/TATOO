import IndicadorCard from './IndicadorCard'

function TotalAgendamentos({ agendamentos, carregando, erro }) {
    let valor = '_';
    let descricao = 'Nenhum dado carregado';

    if (carregando) {
        valor = 'Carregando...';
        descricao = 'Consultando agendamentos...';
    } else if (erro) {
        descricao = erro;
    } else if (Array.isArray(agendamentos)) {
        valor = agendamentos.length;
        descricao = 'Agendamentos registrados';
    }

    return (
        <IndicadorCard
            titulo="Total de agendamentos"
            valor={valor}
            descricao={descricao}
         />
    );
}

export default TotalAgendamentos; 