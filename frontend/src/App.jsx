import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import AppRoutes from './Routes';
import Spacer from './components/Spacer';
import './index.css';

// Componente para renderizar o Navbar condicionalmente
const Layout = () => {
  const location = useLocation();

  // Verifica se a rota atual é '/login', '/cadastro' ou '/resetar-senha'
  const isAuthPage = ['/login', '/cadastro', '/resetar-senha'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && (
        <>
          <Navbar /> {/* Renderiza a Navbar somente quando não estiver nas páginas de autenticação */}
          <Spacer height="40px" />
        </>
      )}
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