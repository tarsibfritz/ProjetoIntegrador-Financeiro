import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Dot } from 'recharts';
import PropTypes from 'prop-types';
import '../styles/Home.css';

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

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
    const { width } = useWindowDimensions();
    const [userName, setUserName] = useState('');
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

    // Função para formatar os valores no formato R$ 0,00
    const currencyFormatter = (value) => {
        const formattedValue = value.toFixed(2).replace('.', ',');
        return `R$ ${formattedValue}`;
    };

    // Função para formatar o texto do tooltip do gráfico de saldo final por mês
    const customTooltipFormatter = (value) => {
        return [`Saldo: ${currencyFormatter(value)}`];
    };

    // Função para determinar a cor do ponto
    const getDotColor = (value) => {
        return value >= 0 ? '#00C49F' : '#FF204E';
    };

    // Função para renderizar o ponto com a cor correta
    const renderCustomizedDot = (props) => {
        const { cx, cy, value } = props;

        return (
            <Dot
                cx={cx}
                cy={cy}
                fill={getDotColor(value)}
                stroke={getDotColor(value)}
                strokeWidth={2}
                r={4}
            />
        );
    };

    renderCustomizedDot.propTypes = {
        cx: PropTypes.number.isRequired,
        cy: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    return (
        <div className="user-container">
            <div className="profile-section">
                <div className="profile-info-balance-container">
                    <div className="profile-info">
                        <h1 id="user-welcome">Olá, {userName}</h1>
                        <div className="user-buttons">
                            <button id="user-launch-button" onClick={() => navigate('/lançamentos')}>Lançamentos</button>
                            <button id="user-simulation-button" onClick={() => navigate('/simulação')}>Simulação</button>
                        </div>
                    </div>
                    <div className="balance-container">
                        <h2>Saldo Total</h2>
                        <p>R${balance.toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="charts-wrapper">
                    <div className="chart-container">
                        <h2>Despesas por Tag</h2>
                        {expensesData.length === 0 ? (
                            <p className="no-data">Nenhum dado encontrado</p>
                        ) : (
                            <PieChart width={width > 768 ? 260 : width - 40} height={260}>
                                <Pie
                                    data={expensesData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
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
                                <Tooltip formatter={currencyFormatter} />
                                <Legend />
                            </PieChart>
                        )}
                    </div>

                    <div className="monthly-balance-container">
                        <h2>Saldo Final por Mês</h2>
                        {monthlyBalanceData.length === 0 ? (
                            <p className="no-data">Nenhum dado encontrado</p>
                        ) : (
                            <LineChart width={width > 768 ? 400 : width - 80} height={250} data={monthlyBalanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip 
                                    formatter={customTooltipFormatter}
                                    labelStyle={{ color: '#000', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#000' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="balance" 
                                    stroke="#fff" 
                                    dot={renderCustomizedDot} 
                                />
                            </LineChart>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
