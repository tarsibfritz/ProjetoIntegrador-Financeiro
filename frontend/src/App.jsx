import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import AppRoutes from './Routes';
import './index.css';

// Componente para renderizar o Navbar condicionalmente
const Layout = () => {
  const location = useLocation();

  // Verifica se a rota atual é '/login' ou '/cadastro'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AppRoutes />
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