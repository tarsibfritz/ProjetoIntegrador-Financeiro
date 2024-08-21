import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import '../../styles/EditExpenseModal.css';

// Função para formatar a data no formato dd/mm/aaaa
const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

// Função para formatar a data no formato yyyy-mm-dd para input
const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
};

// Opções de tags para despesas
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
    const [description, setDescription] = useState(expense.description || '');
    const [amount, setAmount] = useState(expense.amount || '');
    const [date, setDate] = useState(expense.date ? formatDateForDisplay(expense.date) : '');
    const [observation, setObservation] = useState(expense.observation || '');
    const [tag, setTag] = useState(expense.tag || '');

    if (!isOpen) return null;

    const handleSave = () => {
        const updatedExpense = {
            ...expense,
            description,
            amount: parseFloat(amount),
            date: formatDateForInput(date), // Converte para yyyy-mm-dd
            observation,
            tag,
        };
        onSave(updatedExpense);
    };

    return (
        <div className="edit-expense-modal-overlay" onClick={onClose}>
            <div className="edit-expense-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Editar Despesa</h2>
                <div className="modal-details">
                    <div className="detail-item">
                        <label>
                            <strong>Descrição:</strong>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="detail-item">
                        <label>
                            <strong>Valor:</strong>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="detail-item">
                        <label>
                            <strong>Data:</strong>
                            <input
                                type="text" // Usa texto para manter o formato dd/mm/yy
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="dd/mm/aaaa"
                            />
                        </label>
                    </div>
                    <div className="detail-item">
                        <label>
                            <strong>Observação:</strong>
                            <textarea
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="detail-item">
                        <label>
                            <strong>Tag:</strong>
                            <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            >
                                <option value="">Selecione uma tag</option>
                                {tagOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <hr className="divider-line" />
                <div className="edit-expense-buttons">
                    <button onClick={handleSave} className="save-button">Salvar</button>
                    <button className="cancel-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Definição das PropTypes para validação de propriedades
EditExpenseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    expense: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
        date: PropTypes.string,
        observation: PropTypes.string,
        tag: PropTypes.string,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditExpenseModal;