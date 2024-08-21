import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/despesas" element={<ExpensesPage />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;