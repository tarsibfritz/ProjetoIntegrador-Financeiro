import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCommentDots, FaTag } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import "../../styles/ExpenseModal.css";
import "../../styles/InputStyles.css";

// Função para formatar a data no formato dd/mm/aa
const formatDateForDisplay = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
};

// Função para converter a data do formato dd/mm/aa para yyyy-mm-dd
const convertToDateInputFormat = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `20${year}-${month}-${day}`;
};

const ExpenseModal = ({ isOpen, onClose, onAddExpense }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(formatDateForDisplay(new Date()));
    const [observation, setObservation] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [showObservationInput, setShowObservationInput] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);

    // Tags pré-definidas
    const availableTags = [
        'Alimentação',
        'Transporte',
        'Saúde',
        'Educação',
        'Lazer',
        'Moradia',
        'Imprevisto',
        'Cuidados Pessoais'
    ];

    const handleDescriptionChange = (e) => {
        if (e.target.value.length <= 100) {
            setDescription(e.target.value);
        } else {
            toast.warning("Descrição atingiu o limite máximo de 100 caracteres.");
            setTimeout(() => {
                toast.info("Reduza a descrição para menos de 100 caracteres.");
            }, 1500);
        }
    };

    const handleObservationChange = (e) => {
        if (e.target.value.length <= 200) {
            setObservation(e.target.value);
        } else {
            toast.warning("Observação atingiu o limite máximo de 200 caracteres.");
            setTimeout(() => {
                toast.info("Reduza a observação para menos de 200 caracteres.");
            }, 1500);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validação dos campos obrigatórios
        if (!description || !amount || !date || !selectedTag) {
            toast.warning("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Validação do valor
        const numericAmount = parseFloat(amount);
        if (numericAmount <= 0 || isNaN(numericAmount)) {
            toast.warning("O valor deve ser maior que zero.");
            return;
        }

        // Validação da tag
        if (!availableTags.includes(selectedTag)) {
            toast.warning("Tag selecionada é inválida.");
            return;
        }

        // Converter a data para o formato yyyy-mm-dd
        const formattedDate = convertToDateInputFormat(date);

        const expenseData = {
            description,
            amount: numericAmount,
            date: new Date(formattedDate).toISOString(),
            observation,
            tag: selectedTag // Tag única selecionada
        };

        try {
            const response = await axios.post('http://localhost:3000/api/expenses', expenseData);

            if (response.status === 201) {
                toast.success("Despesa salva com sucesso!");
                onAddExpense(expenseData);
                handleClose();
            } else {
                toast.error(`Erro: ${response.data.error || 'Não foi possível salvar a despesa.'}`);
            }
        } catch (error) {
            toast.error(`Erro ao salvar despesa: ${error.message}`);
        }
    };

    const handleClose = () => {
        setDescription('');
        setAmount('');
        setDate(formatDateForDisplay(new Date()));
        setObservation('');
        setSelectedTag('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={handleClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h2>Criar Despesa</h2>
                    <form className="modal-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Descrição</label>
                            <input 
                                type="text" 
                                value={description} 
                                onChange={handleDescriptionChange} 
                                placeholder="Descrição da despesa"
                            />
                        </div>
                        <div className="input-row-wrapper">
                            <div className="input-row">
                                <div className="form-group">
                                    <label>Valor</label>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data</label>
                                    <input 
                                        type="text" 
                                        value={date} 
                                        onChange={(e) => setDate(e.target.value)} 
                                        placeholder="dd/mm/aa"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="observation-button" onClick={() => setShowObservationInput(!showObservationInput)}>
                                <FaCommentDots /> Observação
                            </button>
                            <button type="button" className="tags-button" onClick={() => setShowTagInput(!showTagInput)}>
                                <FaTag /> Tags
                            </button>
                        </div>
                        {showObservationInput && (
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    value={observation} 
                                    onChange={handleObservationChange} 
                                    placeholder="Adicione uma observação"
                                />
                            </div>
                        )}
                        {showTagInput && (
                            <div className="form-group">
                                <label>Tag</label>
                                <div className="tags-input">
                                    <select
                                        value={selectedTag}
                                        onChange={(e) => setSelectedTag(e.target.value)}
                                    >
                                        <option value="">Selecione uma tag</option>
                                        {availableTags.map((tag, index) => (
                                            <option key={index} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={handleClose}>Fechar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

ExpenseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddExpense: PropTypes.func.isRequired,
};

export default ExpenseModal;