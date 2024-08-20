import PropTypes from 'prop-types';
import "../styles/ConfirmModal.css"; 

const ConfirmModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
                <h3>Tem certeza?</h3>
                <p>Você não poderá reverter essa ação!</p>
                <div className="confirm-modal-buttons">
                    <button className="confirm-modal-button" onClick={onConfirm}>Sim, excluir!</button>
                    <button className="cancel-modal-button" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;