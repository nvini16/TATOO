import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/src/style.css';
import '../styles/CalendarioAgendamento.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function converterDataLocal(data) {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

function CalendarioAgendamento({ dataSelecionada, onSelecionarData }) {
    const [datasOcupadas, setDatasOcupadas] = useState([]);
    const [estadoDisponibilidade, setEstadoDisponibilidade] = useState('carregando');
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();

        async function carregarDatasOcupadas() {
            setEstadoDisponibilidade('carregando');

            try {
                const resposta = await fetch(
                    `${API_URL}/api/agendamentos/datas-ocupadas`,
                    {
                        signal: controlador.signal,
                        cache: 'no-store'
                    }
                );

                if (!resposta.ok) {
                    throw new Error('Não foi possível consultar as datas ocupadas.');
                }

                const resultado = await resposta.json();

                if (
                    !resultado ||
                    !Array.isArray(resultado.datas) ||
                    !resultado.datas.every(
                        (data) => typeof data === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(data)
                    )
                ) {
                    throw new Error('A resposta de disponibilidade está inválida.');
                }

                setDatasOcupadas(
                    [...new Set(resultado.datas)].map(converterDataLocal)
                );
                setEstadoDisponibilidade('pronto');
            } catch (erro) {
                if (erro.name === 'AbortError') return;

                console.error('Erro ao carregar datas ocupadas:', erro);
                setEstadoDisponibilidade('erro');
            }
        }

        carregarDatasOcupadas();

        return () => controlador.abort();
    }, [tentativa]);

    const chavesDatasOcupadas = useMemo(
        () => new Set(datasOcupadas.map(formatarDataLocal)),
        [datasOcupadas]
    );

    useEffect(() => {
        if (
            estadoDisponibilidade === 'pronto' &&
            dataSelecionada &&
            chavesDatasOcupadas.has(formatarDataLocal(dataSelecionada))
        ) {
            onSelecionarData(undefined);
        }
    }, [
        estadoDisponibilidade,
        dataSelecionada,
        chavesDatasOcupadas,
        onSelecionarData
    ]);

    const desabilitarData = (data) => {
        if (estadoDisponibilidade !== 'pronto') return true;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return data < hoje || chavesDatasOcupadas.has(formatarDataLocal(data));
    };

    return (
        <div className="calendario-agendamento">
            {estadoDisponibilidade === 'carregando' && (
                <p className="calendario-status" role="status">
                    Carregando disponibilidade do calendário...
                </p>
            )}

            {estadoDisponibilidade === 'erro' && (
                <div className="calendario-erro" role="alert">
                    <p>Não foi possível verificar quais dias estão disponíveis. Tente novamente antes de escolher uma data.</p>
                    <button
                        type="button"
                        className="calendario-tentar-novamente"
                        onClick={() => setTentativa((valor) => valor + 1)}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            <DayPicker
                mode="single"
                locale={ptBR}
                selected={dataSelecionada}
                onSelect={onSelecionarData}
                disabled={desabilitarData}
                modifiers={{ ocupado: datasOcupadas }}
                modifiersClassNames={{ ocupado: 'calendario-dia-ocupado' }}
                weekStartsOn={0}
            />

            {estadoDisponibilidade === 'pronto' && (
                <div className="calendario-legenda" aria-label="Legenda do calendário">
                    <span>
                        <span className="calendario-legenda-marcador ocupado" aria-hidden="true" />
                        Dia ocupado
                    </span>
                    <span>
                        <span className="calendario-legenda-marcador disponivel" aria-hidden="true" />
                        Disponível
                    </span>
                    <span>
                        <span className="calendario-legenda-marcador selecionado" aria-hidden="true" />
                        Dia selecionado
                    </span>
                </div>
            )}
        </div>
    );
}

export default CalendarioAgendamento;
