import { useState, useEffect } from 'react';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import LaunchModal from '../components/launchesComponents/LaunchModal';
import LaunchInfoModal from '../components/launchesComponents/LaunchInfoModal';
import EditLaunchModal from '../components/launchesComponents/EditLaunchModal';
import { getLaunches, addLaunch, deleteLaunch, updateLaunch } from '../services/launchService';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import "../styles/LaunchesPage.css";

// Funções utilitárias
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const getMonthNameInPortuguese = (monthIndex) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex];
};

const calculateBalance = (launches) => {
    const balance = launches.reduce((acc, launch) => {
        return launch.type === 'expense'
            ? acc - launch.amount
            : acc + launch.amount;
    }, 0);

    return balance;
};

// Nova função para obter dados do gráfico com base nas tags
const getTagChartData = (launches) => {
    const tagTotals = launches.reduce((acc, launch) => {
        if (!acc[launch.tag]) {
            acc[launch.tag] = 0;
        }
        acc[launch.tag] += launch.amount;
        return acc;
    }, {});

    return Object.entries(tagTotals).map(([tag, total]) => ({
        name: tag,
        value: total
    }));
};

const LaunchesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLaunch, setSelectedLaunch] = useState(null);
    const [launches, setLaunches] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const loadLaunches = async () => {
            try {
                const data = await getLaunches();
                if (Array.isArray(data)) {
                    setLaunches(data);
                } else {
                    console.error('Dados recebidos não são um array:', data);
                    setLaunches([]);
                }
            } catch (error) {
                console.error('Erro ao carregar lançamentos:', error);
            }
        };

        loadLaunches();
    }, []);

    // Obtendo uma lista única de meses para o filtro
    const getUniqueMonths = (launches) => {
        const months = new Set();
        launches.forEach((launch) => {
            const date = new Date(launch.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            months.add(monthYear);
        });

        // Ordena os meses do mais antigo para o mais recente
        return Array.from(months).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
        });
    };

    const uniqueMonths = getUniqueMonths(launches);

    // Funções para lidar com ações do usuário
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenInfoModal = (launch) => {
        setSelectedLaunch(launch);
        setIsInfoModalOpen(true);
    };

    const handleCloseInfoModal = () => {
        setIsInfoModalOpen(false);
        setSelectedLaunch(null);
    };

    const handleEditLaunch = async (updatedLaunch) => {
        try {
            await updateLaunch(updatedLaunch.id, updatedLaunch);
            const data = await getLaunches();
            setLaunches(data);
            setIsEditModalOpen(false);
            handleCloseInfoModal();
        } catch (error) {
            console.error('Erro ao atualizar lançamento:', error);
        }
    };

    const handleSaveLaunch = async (launch) => {
        try {
            await addLaunch(launch);
            const data = await getLaunches();
            setLaunches(data);
            handleCloseModal();
            toast.success('Lançamento adicionado com sucesso!');
        } catch (error) {
            toast.error('Erro ao adicionar lançamento!');
            console.error('Erro ao adicionar lançamento:', error);
        }
    };

    const handleDeleteLaunch = async (launchId) => {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter essa ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteLaunch(launchId);
                setLaunches(prevLaunches => prevLaunches.filter(launch => launch.id !== launchId));
                handleCloseInfoModal(); // Fechar o modal antes de mostrar o toast
                toast.success('Lançamento excluído com sucesso!');
            } catch (error) {
                toast.error('Erro ao excluir lançamento!');
                console.error('Erro ao excluir lançamento:', error);
            }
        }
    };

    const handlePaidChange = async (launchId) => {
        setLaunches(prevLaunches => {
            const updatedLaunches = prevLaunches.map(launch =>
                launch.id === launchId ? { ...launch, paid: !launch.paid } : launch
            );
            return updatedLaunches;
        });
    
        // Busca o lançamento atualizado
        const launchToUpdate = launches.find(launch => launch.id === launchId);
    
        if (launchToUpdate) {
            try {
                // Atualiza o status "pago" no backend
                await updateLaunch(launchId, { ...launchToUpdate, paid: !launchToUpdate.paid });
                toast.success('Status de pagamento atualizado com sucesso!');
            } catch (error) {
                toast.error('Erro ao atualizar status de pagamento!');
                console.error('Erro ao atualizar status de pagamento:', error);
            }
        }
    };    

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    // Filtra lançamentos por mês
    const filteredLaunches = selectedMonth
        ? launches.filter(launch => {
            const date = new Date(launch.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            return monthYear === selectedMonth;
        })
        : launches;

    // Função para formatar os valores no formato R$ 0,00
    const currencyFormatter = (value) => {
        const formattedValue = value.toFixed(2).replace('.', ',');
        return `R$ ${formattedValue}`;
    };

    const balance = calculateBalance(filteredLaunches);
    const balanceClass = balance >= 0 ? 'balance-positive' : 'balance-negative';

    const calculateTotalExpenses = (launches) => {
        return launches
            .filter(launch => launch.type === 'expense')
            .reduce((acc, launch) => acc + launch.amount, 0);
    };
    
    const calculateTotalIncome = (launches) => {
        return launches
            .filter(launch => launch.type === 'income')
            .reduce((acc, launch) => acc + launch.amount, 0);
    };
    
    return (
        <div className="container">
            <div className="main-content">
                <div className="header">
                    <h1 className="title">Lançamentos</h1>
                </div>
                <div className="header-content">
                    <select className="month-select" value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">Selecionar Mês</option>
                        {uniqueMonths.map((monthYear, index) => {
                            const [year, month] = monthYear.split('-');
                            return (
                                <option key={index} value={monthYear}>
                                    {`${getMonthNameInPortuguese(parseInt(month) - 1)} ${year}`}
                                </option>
                            );
                        })}
                    </select>
                    <button className="add-button" onClick={handleOpenModal}>
                        <FaPlus />
                    </button>
                </div>
                <div className="launches-table-wrapper">
                    <table className="launches-table">
                        <thead>
                            <tr>
                                <th className="info-icon"></th>
                                <th className="description">Descrição</th>
                                <th className="date">Data</th>
                                <th className="amount">Valor</th>
                                <th className="type">Tipo</th>
                                <th className="paid">Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLaunches.map((launch, index) => (
                                <tr key={index} className="launch-row">
                                    <td className="info-icon">
                                        <FaInfoCircle 
                                            className="info-icon" 
                                            onClick={() => handleOpenInfoModal(launch)} 
                                        />
                                    </td>
                                    <td className="description">
                                        {launch.description}
                                    </td>
                                    <td className="date">
                                        {formatDate(launch.date)}
                                    </td>
                                    <td className="amount">
                                        {currencyFormatter(launch.amount)}
                                    </td>
                                    <td className="type">
                                        {launch.type === 'expense' ? 'Despesa' : 'Receita'}
                                    </td>
                                    <td className="paid">
                                        <input 
                                            type="checkbox" 
                                            checked={launch.paid} 
                                            onChange={() => handlePaidChange(launch.id)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="launches-balance-container">
                        <span id="total-balance">Saldo: </span>
                        <span className={`balance ${balanceClass}`}>
                            {currencyFormatter(balance)}
                        </span>
                    </div>
                </div>

                <LaunchModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveLaunch}
                />

                {selectedLaunch && (
                    <LaunchInfoModal
                        isOpen={isInfoModalOpen}
                        onClose={handleCloseInfoModal}
                        launch={selectedLaunch}
                        onDelete={handleDeleteLaunch}
                        onEdit={() => {
                            setIsEditModalOpen(true);
                        }}
                    />
                )}

                {selectedLaunch && (
                    <EditLaunchModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        launch={selectedLaunch}
                        onSave={handleEditLaunch}
                    />
                )}
            </div>

            <div className="launches-chart-container">
                <h2>Relatório</h2>
                {selectedMonth ? (
                    <div>
                        <div className="monthly-balance-summary">
                            <p><strong>Despesas:</strong> {currencyFormatter(calculateTotalExpenses(filteredLaunches))}</p>
                            <p><strong>Receitas:</strong> {currencyFormatter(calculateTotalIncome(filteredLaunches))}</p>
                        </div>
                        <PieChart width={200} height={200}>
                            <Pie
                                data={getTagChartData(filteredLaunches)}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                fill="#8884d8"
                                labelLine={false}
                            >
                                {getTagChartData(filteredLaunches).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#FF204E', '#9400FF', '#F94C10', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF99CC', '#66FF66', '#FF66B2'][index % 10]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={currencyFormatter} />
                            <Legend />
                        </PieChart>
                    </div>
                ) : (
                    <p>Filtre um mês específico para gerarmos o relatório</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default LaunchesPage;