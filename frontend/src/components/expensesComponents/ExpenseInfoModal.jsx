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

    // Garantir que as tags são uma lista de strings
    const description = typeof expense.description === 'string' ? expense.description : 'Descrição não disponível';
    const amount = typeof expense.amount === 'number' ? expense.amount.toFixed(2) : '0.00';
    const date = typeof expense.date === 'string' ? formatDate(expense.date) : 'Data não disponível';
    const observation = typeof expense.observation === 'string' && expense.observation.trim() !== '' 
        ? expense.observation 
        : 'Nenhuma observação informada';
    
    // Extrair nomes das tags
    const tags = Array.isArray(expense.tags) 
        ? expense.tags.map(tag => tag.name ? tag.name : 'Tag inválida') 
        : [];

    return (
        <div className="expense-info-modal-overlay" onClick={onClose}>
            <div className="expense-info-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Detalhes da Despesa</h2>
                <div className="modal-details">
                    <div className="detail-item">
                        <div className="detail-item-left">
                            <strong>Descrição:</strong> {description}
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-item-row">
                            <div className="detail-item-value">
                                <strong>Valor:</strong> R$ {amount}
                            </div>
                            <div className="detail-item-date">
                                <strong>Data:</strong> {date}
                            </div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-item-row">
                            <div className="detail-item-observation">
                                <strong>Observação:</strong> {observation}
                            </div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-item-tags">
                            <strong>Tags:</strong>
                            <div className="tags-container">
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
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
        tags: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        })).isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ExpenseInfoModal;