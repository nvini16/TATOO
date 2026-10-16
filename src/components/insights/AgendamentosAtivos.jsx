import IndicadorCard from './IndicadorCard';

function AgendamentosAtivos({ agendamentos, carregando, erro }) {
    let valor = '_';
    let descricao = 'Nenhum dado carregado';

    if (carregando) {
        valor = 'Carregando...';
        descricao = 'Consultando agendamentos...';
    } else if (erro) {
        descricao = erro;
    } else if (Array.isArray(agendamentos)) {
        const statusAtivos = [
            'aguardando_sinal',
            'sinal_pago',
            'aguardando_confirmacao',
            'confirmado',
        ];

        valor = agendamentos.filter((agendamentos) => statusAtivos.includes(agendamentos.status)).length;
        descricao = 'Agendamentos em andamento';
    }

    return (
        <IndicadorCard 
            titulo="Agendamentos ativos"
            valor={valor}
            descricao={descricao}
        />
    );
}

export default AgendamentosAtivos;