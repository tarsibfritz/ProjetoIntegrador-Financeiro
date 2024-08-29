import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from '../components/ConfirmModal';
import LaunchModal from '../components/launchesComponents/LaunchModal';
import LaunchInfoModal from '../components/launchesComponents/LaunchInfoModal';
import EditLaunchModal from '../components/launchesComponents/EditLaunchModal';
import { getLaunches, addLaunch, deleteLaunch, updateLaunch } from '../services/launchService';
import { groupLaunchesByMonth } from '../utils/launchesUtils';
import "../styles/LaunchesPage.css";

// Funções utilitárias...
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

const LaunchesPage = () => {
    // Estados do componente...
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLaunch, setSelectedLaunch] = useState(null);
    const [launches, setLaunches] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [launchToDelete, setLaunchToDelete] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const containerRef = useRef(null);

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

    // Agrupando lançamentos por mês...
    const groupedLaunches = groupLaunchesByMonth(launches);

    // Funções para lidar com ações do usuário...
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

    const handleEditLaunch = async (updatedLaunch) => {
        try {
            await updateLaunch(updatedLaunch.id, updatedLaunch);
            const data = await getLaunches();
            setLaunches(data);
            setIsEditModalOpen(false);
            handleCloseInfoModal();
            toast.success('Lançamento atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar lançamento!');
            console.error('Erro ao atualizar lançamento:', error);
        }
    };

    const handleDeleteLaunch = (launchId) => {
        setLaunchToDelete(launchId);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteLaunch(launchToDelete);
            setLaunches(prevLaunches => prevLaunches.filter(launch => launch.id !== launchToDelete));
            setShowConfirmModal(false);
            handleCloseInfoModal();
            toast.success('Lançamento excluído com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir lançamento!');
            console.error('Erro ao excluir lançamento:', error);
        }
    };

    const handlePaidChange = (launchId) => {
        setLaunches(prevLaunches => {
            const updatedLaunches = prevLaunches.map(launch =>
                launch.id === launchId ? { ...launch, paid: !launch.paid } : launch
            );
            return updatedLaunches;
        });
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    // Lista de meses disponíveis para o filtro
    const months = Object.keys(groupedLaunches).map(key => {
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const monthName = getMonthNameInPortuguese(monthIndex);
        return { value: key, label: `${monthName} ${year}` };
    }).sort((a, b) => new Date(b.value) - new Date(a.value));

    // Adiciona "Todos os meses" como a primeira opção na lista
    months.unshift({ value: '', label: 'Todos os meses' });

    const filteredLaunches = selectedMonth ? groupedLaunches[selectedMonth] || [] :
        Object.values(groupedLaunches).flat();

    const balance = calculateBalance(filteredLaunches);
    const balanceClass = balance >= 0 ? 'balance-positive' : 'balance-negative';

    return (
        <div>
            <div className="container" ref={containerRef}>
                <div className="header-content">
                    <div className="sort-container">
                        <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange} className="month-select">
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="add-container">
                            <button className="add-button" onClick={handleOpenModal}>
                                <FaPlus size={17} />
                            </button>
                    </div>
                </div>
                <div className="launches-table">
                    <table>
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
                                        R$ {launch.amount.toFixed(2)}
                                    </td>
                                    <td className="type">
                                        {launch.type === 'expense' ? 'Despesa' : 'Receita'}
                                    </td>
                                    <td className="paid">
                                        <div className="paid-checkbox-container">
                                            <input 
                                                type="checkbox" 
                                                checked={launch.paid || false} 
                                                onChange={() => handlePaidChange(launch.id)} 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="6" className={`balance ${balanceClass}`}>
                                    Saldo: R$ {balance.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <LaunchModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddLaunch={handleSaveLaunch}
                />
                {selectedLaunch && (
                    <>
                        <LaunchInfoModal
                            isOpen={isInfoModalOpen}
                            onClose={handleCloseInfoModal}
                            launch={selectedLaunch}
                            onEdit={() => {
                                setIsInfoModalOpen(false);
                                setIsEditModalOpen(true);
                            }}
                            onDelete={() => handleDeleteLaunch(selectedLaunch.id)}
                        />
                        <EditLaunchModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            launch={selectedLaunch}
                            onSave={handleEditLaunch}
                        />
                    </>
                )}
                <ConfirmModal
                    show={showConfirmModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmModal(false)}
                    message="Tem certeza de que deseja excluir este lançamento?"
                />
                <ToastContainer />
            </div>
        </div>
    );
};

export default LaunchesPage;