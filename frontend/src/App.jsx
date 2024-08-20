import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importe o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importe o CSS para Toastify
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <Router>
      <ToastContainer /> {/* Adicione o ToastContainer aqui */}
      <Routes>
        <Route path="/despesas" element={<ExpensesPage />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;