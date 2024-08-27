import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import '../styles/Home.css';

// Funções para cálculo
const calculateBalance = (launches) => {
    return launches.reduce((acc, launch) => {
        return launch.type === 'expense'
            ? acc - launch.amount
            : acc + launch.amount;
    }, 0);
};

const groupExpensesByTag = (launches) => {
    const expenseGroups = launches.reduce((acc, launch) => {
        if (launch.type === 'expense') {
            acc[launch.tag] = (acc[launch.tag] || 0) + launch.amount;
        }
        return acc;
    }, {});

    return Object.entries(expenseGroups).map(([tag, amount]) => ({ name: tag, value: amount }));
};

const groupMonthlyBalance = (launches) => {
    const monthlyBalance = launches.reduce((acc, launch) => {
        const month = new Date(launch.date).toISOString().slice(0, 7); // 'YYYY-MM'
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += launch.type === 'expense' ? -launch.amount : launch.amount;
        return acc;
    }, {});

    return Object.entries(monthlyBalance).map(([month, balance]) => ({
        name: month,
        balance
    }));
};

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [launches, setLaunches] = useState([]);
    const [balance, setBalance] = useState(0);
    const [expensesData, setExpensesData] = useState([]);
    const [monthlyBalanceData, setMonthlyBalanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('userName');
        setUserName(name || 'Usuário');

        const fetchLaunches = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/launches');
                if (!response.ok) {
                    throw new Error('Erro ao buscar lançamentos');
                }
                const data = await response.json();
                setLaunches(data);

                const totalBalance = calculateBalance(data);
                const expensesByTag = groupExpensesByTag(data);
                const monthlyBalance = groupMonthlyBalance(data);

                setBalance(totalBalance);
                setExpensesData(expensesByTag);
                setMonthlyBalanceData(monthlyBalance);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLaunches();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div className="user-container">
            <div className="profile-section">
                <div className="profile-info-balance-container">
                    <div className="profile-info">
                        <h1 id="user-welcome">Olá, {userName}</h1>
                        <div className="user-buttons">
                            <button id="user-launch-button" onClick={() => navigate('/lançamentos')}>Lançamentos</button>
                            <button id="user-simulation-button">Simulação</button>
                        </div>
                    </div>
                    <div className="balance-container">
                        <h2>Saldo Total</h2>
                        <p>R${balance.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="charts-wrapper">
                    <div className="chart-container">
                        <h2>Despesas por Tag</h2>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={expensesData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                fill="#8884d8"
                            >
                                {expensesData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={[
                                            '#FF204E', '#9400FF', '#F94C10', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF99CC', '#66FF66', '#FF66B2'
                                        ][index % 10]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    <div className="monthly-balance-container">
                        <h2>Saldo Final por Mês</h2>
                        <LineChart width={500} height={300} data={monthlyBalanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="balance" stroke="#fff" />
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;