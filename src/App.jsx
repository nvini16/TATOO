import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamento from './pages/Agendamentos';
import LoginAdmin from './pages/LoginAdmin';
import Insights from './pages/Insights';

function App() {
  return (
    <BrowserRouter basename="/TATOO">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Agendamento" element={<Agendamento />} />
        <Route path="/LoginAdmin" element={<LoginAdmin/>} />
        <Route path="/Insights" element={<Insights/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App