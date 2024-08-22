import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LaunchesPage from './pages/LaunchesPage';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/lançamentos" element={<LaunchesPage />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;