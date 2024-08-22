import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/EditLaunchModal.css'; // Atualize o nome do arquivo CSS se necessário

const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const expenseTags = [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Moradia',
    'Imprevisto',
    'Cuidados Pessoais'
];

const incomeTags = [
    'Salário',
    'Freelance',
    'Vendas',
    'Investimentos',
    'Outros'
];

const EditLaunchModal = ({ isOpen, onClose, launch, onSave }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [observation, setObservation] = useState('');
    const [tag, setTag] = useState('');
    const [type, setType] = useState('');
    const [paid, setPaid] = useState(false); // Incluído para compatibilidade, se necessário

    useEffect(() => {
        if (launch) {
            setDescription(launch.description || '');
            setAmount(launch.amount ? launch.amount.toString() : '');
            setDate(launch.date ? formatDateForDisplay(launch.date) : '');
            setObservation(launch.observation || '');
            setTag(launch.tag || '');
            setType(launch.type || ''); // Atualizado para tipo
            setPaid(launch.paid || false); // Incluído para compatibilidade, se necessário
        }
    }, [launch]);

    if (!isOpen) return null;

    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
    const handleObservationChange = (e) => setObservation(e.target.value);
    const handleTagChange = (e) => setTag(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);
    const handlePaidChange = (e) => setPaid(e.target.checked); // Incluído para compatibilidade, se necessário

    const handleSave = async () => {
        const dateISO = new Date(date.split('/').reverse().join('-')).toISOString();

        const updatedLaunch = {
            ...launch,
            description,
            amount: parseFloat(amount),
            date: dateISO,
            observation,
            tag,
            type, // Atualizado para tipo
            paid,
        };

        try {
            const response = await axios.put(`http://localhost:3000/api/launches/${launch.id}`, updatedLaunch);
            if (response.status === 200) {
                toast.success("Lançamento atualizado com sucesso!");
                onSave(updatedLaunch);
                onClose();
            } else {
                toast.error(`Erro: ${response.data.error || 'Não foi possível atualizar o lançamento.'}`);
            }
        } catch (error) {
            toast.error(`Erro ao atualizar lançamento: ${error.message}`);
            console.error('Erro ao atualizar lançamento:', error);
        }
    };

    const tags = type === 'Despesa' ? expenseTags : type === 'Receita' ? incomeTags : [];

    return (
        <div className="edit-launch-modal-overlay" onClick={onClose}>
            <div className="edit-launch-modal-container" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Editar Lançamento</h2>
                <div className="modal-form-wrapper">
                    <div className="modal-form">
                        <div className="form-group">
                            <label htmlFor="launch-type">
                                <strong>Tipo:</strong>
                                <select
                                    id="launch-type"
                                    value={type}
                                    onChange={handleTypeChange}
                                >
                                    <option value="">Selecione um tipo</option>
                                    <option value="Despesa">Despesa</option>
                                    <option value="Receita">Receita</option>
                                </select>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="launch-description">
                                <strong>Descrição:</strong>
                                <input
                                    id="launch-description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="launch-amount">
                                    <strong>Valor:</strong>
                                    <input
                                        id="launch-amount"
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="launch-date">
                                    <strong>Data:</strong>
                                    <input
                                        id="launch-date"
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
                                <label htmlFor="launch-observation">
                                    <strong>Observação:</strong>
                                    <textarea
                                        id="launch-observation"
                                        value={observation}
                                        onChange={handleObservationChange}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="launch-tag">
                                    <strong>Tag:</strong>
                                    <select
                                        id="launch-tag"
                                        value={tag}
                                        onChange={handleTagChange}
                                    >
                                        <option value="">Selecione uma tag</option>
                                        {tags.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <label htmlFor="launch-paid">
                                <input
                                    id="launch-paid"
                                    type="checkbox"
                                    checked={paid}
                                    onChange={handlePaidChange}
                                />
                                <strong>Pago:</strong>
                            </label>
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

EditLaunchModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    launch: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
        date: PropTypes.string,
        observation: PropTypes.string,
        tag: PropTypes.string,
        type: PropTypes.string, // Adicionado para tipo
        paid: PropTypes.bool, // Incluído para compatibilidade, se necessário
        id: PropTypes.number.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditLaunchModal;