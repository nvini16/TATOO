import IndicadorCard from './IndicadorCard';

function TaxaComparecimento({ agendamentos, carregando, erro }) {
    let valor = '—';
    let descricao = 'Sem dados de atendimentos finalizados';

    if (carregando) {
        valor = 'Carregando...';
        descricao = 'Calculando taxa de comparecimento...';
    } else if (erro) {
        descricao = erro;
    } else if (Array.isArray(agendamentos)) {
        const concluidos = agendamentos.filter(
            (agendamento) => agendamento.status === 'concluido'
        ).length;

        const faltas = agendamentos.filter(
            (agendamento) => agendamento.status === 'faltou'
        ).length;

        const totalFinalizados = concluidos + faltas;

        if (totalFinalizados > 0) {
            valor = `${Math.round((concluidos / totalFinalizados) * 100)}%`;
            descricao = `${concluidos} comparecimentos em ${totalFinalizados} resultados`;
        }
    }

    return (
        <IndicadorCard
            titulo="Taxa de comparecimento"
            valor={valor}
            descricao={descricao}
        />
    );
}

export default TaxaComparecimento;
