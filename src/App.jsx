import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamento from './pages/Agendamentos';
import LoginAdmin from './pages/LoginAdmin';
import Insights from './pages/Insights';
import AgendamentosAdmin from './pages/AgendamentosAdmin';
import ClientesAdmin from './pages/ClientesAdmin';
import ClientePerfil from './pages/ClientePerfil';
import RedefinirSenha from './pages/RedefinirSenha';

function App() {
  return (
    <BrowserRouter basename="/TATOO">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Agendamento" element={<Agendamento />} />
        <Route path="/LoginAdmin" element={<LoginAdmin/>} />
        <Route path="/Insights" element={<Insights/>} />
        <Route path="/AgendamentosAdmin" element={<AgendamentosAdmin/>} />
        <Route path="/ClientesAdmin" element={<ClientesAdmin/>} />
        <Route path="/ClientePerfil/:id" element={<ClientePerfil/>} />
        <Route path="/RedefinirSenha" element={<RedefinirSenha/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App