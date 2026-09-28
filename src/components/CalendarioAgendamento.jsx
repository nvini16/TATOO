import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/src/style.css';
import '../styles/CalendarioAgendamento.css';

function CalendarioAgendamento({ dataSelecionada, onSelecionarData }) {
    return (
        <div className="calendario-agendamento">
            <DayPicker 
                mode="single"
                locale={ptBR}
                selected={dataSelecionada}
                onSelect={onSelecionarData}
                disabled={{ before: new Date() }}
                weekStartsOn={0}
            />
        </div>                                                                                                                  
    );
}

export default CalendarioAgendamento