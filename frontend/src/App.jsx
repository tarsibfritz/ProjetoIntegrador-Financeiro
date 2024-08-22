import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import LaunchesPage from './pages/LaunchesPage';
import Navbar from './components/Navbar';
import './index.css';

// Componente para renderizar o Navbar condicionalmente
const Layout = () => {
  const location = useLocation();

  // Verifica se a rota atual é '/cadastro'
  const isRegisterPage = location.pathname === '/cadastro';

  return (
    <>
      {!isRegisterPage && <Navbar />}
      <Routes>
        <Route path="/cadastro" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/lançamentos" element={<LaunchesPage />} />
        {/* Outras rotas */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Layout />
    </Router>
  );
}

export default App;