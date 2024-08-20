import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from '../components/ConfirmModal';
import ExpenseModal from '../components/expensesComponents/ExpenseModal';
import ExpenseInfoModal from '../components/expensesComponents/ExpenseInfoModal';
import { getExpenses, addExpense, deleteExpense } from '../services/expenseService';
import "../styles/ExpensesPage.css";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const ExpensesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const data = await getExpenses();
                if (Array.isArray(data)) {
                    setExpenses(data);
                } else {
                    console.error('Dados recebidos não são um array:', data);
                    setExpenses([]); // Define um array vazio como fallback
                }
            } catch (error) {
                console.error('Erro ao carregar despesas:', error);
            }
        };

        loadExpenses();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenInfoModal = (expense) => {
        setSelectedExpense(expense);
        setIsInfoModalOpen(true);
    };
    const handleCloseInfoModal = () => {
        setIsInfoModalOpen(false);
        setSelectedExpense(null);
    };

    const handleAddExpense = async (expense) => {
        try {
            await addExpense(expense);
            const data = await getExpenses();
            setExpenses(data);
            handleCloseModal();
            toast.success('Despesa adicionada com sucesso!');
        } catch (error) {
            toast.error('Erro ao adicionar despesa!');
            console.error('Erro ao adicionar despesa:', error);
        }
    };

    const handleDeleteExpense = (expenseId) => {
        setExpenseToDelete(expenseId);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteExpense(expenseToDelete);
            setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseToDelete));
            setShowConfirmModal(false);
            handleCloseInfoModal();
            toast.success('Despesa excluída com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir despesa!');
            console.error('Erro ao excluir despesa:', error);
        }
    };

    const handlePaidChange = (expenseId) => {
        setExpenses(prevExpenses => {
            const updatedExpenses = prevExpenses.map(expense =>
                expense.id === expenseId ? { ...expense, paid: !expense.paid } : expense
            );
            return updatedExpenses;
        });
    };

    return (
        <div>
            <div className="container" ref={containerRef}>
                <div className="header">
                    <h1 className="title">Despesas</h1>
                    <div className="add-container">
                        <button className="add-button" onClick={handleOpenModal}>
                            <FaPlus size={17} />
                        </button>
                    </div>
                </div>
                <div className="expenses-table">
                    <table>
                        <thead>
                            <tr>
                                <th className="info-icon"></th>
                                <th className="description">Descrição</th>
                                <th className="date">Data</th>
                                <th className="amount">Valor</th>
                                <th className="paid">Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={index} className="expense-row">
                                    <td className="info-icon">
                                        <FaInfoCircle 
                                            className="info-icon" 
                                            onClick={() => handleOpenInfoModal(expense)} 
                                        />
                                    </td>
                                    <td className="description">
                                        {expense.description}
                                    </td>
                                    <td className="date">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="amount">
                                        R$ {expense.amount.toFixed(2)}
                                    </td>
                                    <td className="paid">
                                        <input 
                                            type="checkbox" 
                                            checked={expense.paid || false} 
                                            onChange={() => handlePaidChange(expense.id)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ExpenseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddExpense={handleAddExpense}
                />
                {selectedExpense && (
                    <ExpenseInfoModal
                        isOpen={isInfoModalOpen}
                        onClose={handleCloseInfoModal}
                        expense={selectedExpense}
                        onEdit={() => {/* lógica de edição */}}
                        onDelete={() => handleDeleteExpense(selectedExpense.id)}
                    />
                )}
                <ConfirmModal
                    show={showConfirmModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmModal(false)}
                />
                <ToastContainer />
            </div>
        </div>
    );
};

export default ExpensesPage;