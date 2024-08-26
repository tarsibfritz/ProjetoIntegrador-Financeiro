import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../styles/Home.css';

// Função para calcular o saldo total
const calculateBalance = (launches) => {
    return launches.reduce((acc, launch) => {
        return launch.type === 'expense'
            ? acc - launch.amount
            : acc + launch.amount;
    }, 0);
};

// Função para agrupar despesas por tag
const groupExpensesByTag = (launches) => {
    const expenseGroups = launches.reduce((acc, launch) => {
        if (launch.type === 'expense') {
            acc[launch.tag] = (acc[launch.tag] || 0) + launch.amount;
        }
        return acc;
    }, {});

    return Object.entries(expenseGroups).map(([tag, amount]) => ({ name: tag, value: amount }));
};

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [launches, setLaunches] = useState([]);
    const [balance, setBalance] = useState(0);
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para controle de carregamento
    const [error, setError] = useState(null); // Estado para mensagens de erro

    useEffect(() => {
        // Recupera o nome do usuário do localStorage
        const name = localStorage.getItem('userName');
        setUserName(name || 'Usuário');

        // Função para buscar dados da API
        const fetchLaunches = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/launches'); // Substitua pela URL da sua API
                if (!response.ok) {
                    throw new Error('Erro ao buscar lançamentos');
                }
                const data = await response.json();
                setLaunches(data);

                // Calcula o saldo e os dados para o gráfico
                const totalBalance = calculateBalance(data);
                const expensesByTag = groupExpensesByTag(data);

                setBalance(totalBalance);
                setExpensesData(expensesByTag);
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
                <div className="profile-info">
                    <h1 id="user-welcome">Olá, {userName}</h1>
                    <div className="user-buttons">
                        <button id="user-launch-button">Lançamentos</button>
                        <button id="user-simulation-button">Simulação</button>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="balance-container">
                    <h2>Saldo Total</h2>
                    <p>{balance.toFixed(2)} BRL</p>
                </div>

                <div className="chart-container">
                    <h2>Despesas por Tag</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={expensesData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={150}
                            fill="#8884d8"
                        >
                            {expensesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#ff9999', '#66b3ff', '#99ff99'][index % 3]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default HomePage;