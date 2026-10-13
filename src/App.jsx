import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamento from './pages/Agendamentos';
import LoginAdmin from './pages/LoginAdmin';

function App() {
  return (
    <BrowserRouter basename="/TATOO">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Agendamento" element={<Agendamento />} />
        <Route path="/LoginAdmin" element={<LoginAdmin/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App