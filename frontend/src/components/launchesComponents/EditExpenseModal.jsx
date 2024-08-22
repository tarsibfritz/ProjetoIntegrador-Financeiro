import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/EditExpenseModal.css';

const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const tagOptions = [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Moradia',
    'Imprevisto',
    'Cuidados Pessoais'
];

const EditExpenseModal = ({ isOpen, onClose, expense, onSave }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [observation, setObservation] = useState('');
    const [tag, setTag] = useState('');
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (expense) {
            setDescription(expense.description || '');
            setAmount(expense.amount ? expense.amount.toString() : '');
            setDate(expense.date ? formatDateForDisplay(expense.date) : '');
            setObservation(expense.observation || '');
            setTag(expense.tag || '');
            setPaid(expense.paid || false);
        }
    }, [expense]);

    if (!isOpen) return null;

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleObservationChange = (e) => {
        setObservation(e.target.value);
    };

    const handleTagChange = (e) => {
        setTag(e.target.value);
    };

    const handlePaidChange = (e) => {
        setPaid(e.target.checked);
    };

    const handleSave = async () => {
        const dateISO = new Date(date.split('/').reverse().join('-')).toISOString();

        const updatedExpense = {
            ...expense,
            description,
            amount: parseFloat(amount),
            date: dateISO,
            observation,
            tag,
            paid,
        };

        try {
            const response = await axios.put(`http://localhost:3000/api/expenses/${expense.id}`, updatedExpense);
            if (response.status === 200) {
                toast.success("Despesa atualizada com sucesso!");
                onSave(updatedExpense);
                onClose();
            } else {
                toast.error(`Erro: ${response.data.error || 'Não foi possível atualizar a despesa.'}`);
            }
        } catch (error) {
            toast.error(`Erro ao atualizar despesa: ${error.message}`);
            console.error('Erro ao atualizar despesa:', error);
        }
    };

    return (
        <div className="edit-expense-modal-overlay" onClick={onClose}>
            <div className="edit-expense-modal-container" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Editar Despesa</h2>
                <div className="modal-form-wrapper">
                    <div className="modal-form">
                        <div className="form-group">
                            <label htmlFor="expense-description">
                                <strong>Descrição:</strong>
                                <input
                                    id="expense-description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="expense-amount">
                                    <strong>Valor:</strong>
                                    <input
                                        id="expense-amount"
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="expense-date">
                                    <strong>Data:</strong>
                                    <input
                                        id="expense-date"
                                        type="text"
                                        value={date}
                                        onChange={handleDateChange}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="form-group-observation-tag">
                            <div className="form-group">
                                <label htmlFor="expense-observation">
                                    <strong>Observação:</strong>
                                    <textarea
                                        id="expense-observation"
                                        value={observation}
                                        onChange={handleObservationChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group-tag">
                                <label htmlFor="expense-tag">
                                    <strong>Tag:</strong>
                                    <select
                                        id="expense-tag"
                                        value={tag}
                                        onChange={handleTagChange}
                                    >
                                        <option value="">Selecione uma tag</option>
                                        {tagOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor="expense-paid">
                                    <input
                                        id="expense-paid"
                                        type="checkbox"
                                        checked={paid}
                                        onChange={handlePaidChange}
                                    />
                                    <strong>Pago:</strong>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={handleSave} className="modal-save-button">Salvar</button>
                    <button className="modal-cancel-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

EditExpenseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    expense: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
        date: PropTypes.string,
        observation: PropTypes.string,
        tag: PropTypes.string,
        paid: PropTypes.bool,
        id: PropTypes.number.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditExpenseModal;