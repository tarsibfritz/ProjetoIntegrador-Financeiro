import { Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import HomePage from '../src/pages/HomePage';
import LaunchesPage from '../src/pages/LaunchesPage';
import PrivateRoute from '../src/components/PrivateRoute';
import SimulationsPage from '../src/pages/SimulationsPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/lançamentos"
                element={
                    <PrivateRoute>
                        <LaunchesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/simulação"
                element={
                    <PrivateRoute>
                        <SimulationsPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;