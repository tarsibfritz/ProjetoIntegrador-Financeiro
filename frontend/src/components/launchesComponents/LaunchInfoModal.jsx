import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../../styles/LaunchInfoModal.css';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const LaunchInfoModal = ({ isOpen, onClose, launch, onEdit, onDelete }) => {
    if (!isOpen) return null;

    const description = typeof launch.description === 'string' ? launch.description : 'Descrição não disponível';
    const amount = typeof launch.amount === 'number' ? launch.amount.toFixed(2) : '0.00';
    const tag = typeof launch.tag === 'string' ? launch.tag : 'Tag não disponível';
    const date = typeof launch.date === 'string' ? formatDate(launch.date) : 'Data não disponível';
    const observation = typeof launch.observation === 'string' && launch.observation.trim() !== '' 
        ? launch.observation 
        : 'Nenhuma observação informada';
    const type = typeof launch.type === 'string' ? launch.type : 'Tipo não disponível'; // Adicionado para tipo

    return (
        <div className="launch-info-modal-overlay" onClick={onClose}>
            <div className="launch-info-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Detalhes do Lançamento ({type})</h2>
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
                            <strong>Tag:</strong> {tag} 
                        </div>
                    </div>
                </div>
                <hr className="divider-line" />
                <div className="launch-info-buttons">
                    <button 
                        className="launch-info-edit-button" 
                        onClick={() => onEdit(launch)}
                        title="Editar informações"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        className="launch-info-delete-button" 
                        onClick={() => onDelete(launch)}
                        title="Excluir lançamento"
                    >
                        <FaTrash />
                    </button>
                </div>
                <button className="launch-info-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

LaunchInfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    launch: PropTypes.shape({
        description: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        observation: PropTypes.string,
        tag: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired, // Adicionado para tipo
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default LaunchInfoModal;