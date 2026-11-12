import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamento from './pages/Agendamentos';
import LoginAdmin from './pages/LoginAdmin';
import LoginCliente from './pages/LoginCliente';
import Insights from './pages/Insights';
import AgendamentosAdmin from './pages/AgendamentosAdmin';
import ClientesAdmin from './pages/ClientesAdmin';
import ClientePerfil from './pages/ClientePerfil';
import RedefinirSenha from './pages/RedefinirSenha';
import CadastroCliente from './pages/CadastroCliente';
import MarsaliUser from './pages/MarsaliUser';
import PerfilUser from './pages/PerfilUser';

function App() {
  return (
    <BrowserRouter basename="/TATOO">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Agendamento" element={<Agendamento />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/LoginCliente" element={<LoginCliente />} />
        <Route path="/Insights" element={<Insights />} />
        <Route path="/AgendamentosAdmin" element={<AgendamentosAdmin />} />
        <Route path="/ClientesAdmin" element={<ClientesAdmin />} />
        <Route path="/ClientePerfil/:id" element={<ClientePerfil />} />
        <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
        <Route path="/CadastroCliente" element={<CadastroCliente />} />
        <Route path="/MarsaliUser" element={<MarsaliUser />} />
        <Route path="/PerfilUser" element={<PerfilUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
