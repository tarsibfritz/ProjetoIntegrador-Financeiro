import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../../styles/ExpenseInfoModal.css';

// Função para formatar a data no formato dd/mm/aaaa
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const ExpenseInfoModal = ({ isOpen, onClose, expense, onEdit, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="expense-info-modal-overlay" onClick={onClose}>
            <div className="expense-info-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Detalhes da Despesa</h2>
                <div className="modal-details">
                    <div className="detail-item">
                        <div className="detail-item-left">
                            {expense.description}
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-item-row">
                            <div className="detail-item-value">
                                <strong>Valor:</strong> R$ {expense.amount.toFixed(2)}
                            </div>
                            <div className="detail-item-date">
                                <strong>Data:</strong> {formatDate(expense.date)}
                            </div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-item-row">
                            <div className="detail-item-observation">
                                <strong>Observação:</strong> {expense.observation || 'Nenhuma'}
                            </div>
                            <div className="detail-item-tags">
                                <strong>Tags:</strong>
                                <div className="tags-container">
                                    {expense.tags.length > 0 ? (
                                        expense.tags.map((tag, index) => (
                                            <span key={index} className="tag-item">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        'Nenhuma'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="divider-line" />
                <div className="expense-info-buttons">
                    <button 
                        className="expense-info-edit-button" 
                        onClick={() => onEdit(expense)}
                        title="Editar informações"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        className="expense-info-delete-button" 
                        onClick={() => onDelete(expense)}
                        title="Excluir lançamento"
                    >
                        <FaTrash />
                    </button>
                </div>
                <button className="expense-info-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

// Definição das PropTypes para validação de propriedades
ExpenseInfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    expense: PropTypes.shape({
        description: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        observation: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ExpenseInfoModal;