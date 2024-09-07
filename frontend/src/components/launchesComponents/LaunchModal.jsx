import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCommentDots } from 'react-icons/fa';
import PropTypes from 'prop-types';
import "../../styles/LaunchModal.css";
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

const LaunchModal = ({ isOpen, onClose, onSave }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(formatDateForDisplay(new Date()));
    const [observation, setObservation] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [showObservationInput, setShowObservationInput] = useState(false);
    const [type, setType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        'Investimentos',
        'Outros'
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

        if (isSubmitting) return; // Evita múltiplas submissões

        setIsSubmitting(true);

        // Validação dos campos obrigatórios
        if (!description || !amount || !date || !selectedTag || !type) {
            toast.warning("Por favor, preencha todos os campos obrigatórios.");
            setIsSubmitting(false);
            return;
        }

        // Validação do valor
        const numericAmount = parseFloat(amount);
        if (numericAmount <= 0 || isNaN(numericAmount)) {
            toast.warning("O valor deve ser maior que zero.");
            setIsSubmitting(false);
            return;
        }

        // Validação da tag
        const tags = type === 'Despesa' ? expenseTags : incomeTags;
        if (!tags.includes(selectedTag)) {
            toast.warning("Tag selecionada é inválida.");
            setIsSubmitting(false);
            return;
        }

        // Converter a data para o formato yyyy-mm-dd
        const formattedDate = convertToDateInputFormat(date);

        // Ajustar o tipo para 'expense' ou 'income'
        const launchType = type === 'Despesa' ? 'expense' : 'income';

        const launchData = {
            description,
            amount: numericAmount,
            date: new Date(formattedDate).toISOString(),
            observation,
            tag: selectedTag,
            type: launchType
        };

        try {
            await onSave(launchData);
            toast.success("Lançamento salvo com sucesso!");
            handleClose();
        } catch (error) {
            toast.error(`Erro ao salvar lançamento: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setDescription('');
        setAmount('');
        setDate(formatDateForDisplay(new Date()));
        setObservation('');
        setSelectedTag('');
        setType('');
        setShowObservationInput(false); // Garante que a observação esteja oculta ao fechar
        onClose();
    };

    if (!isOpen) return null; // Garante que o modal não seja exibido quando isOpen é false

    const tags = type === 'Despesa' ? expenseTags : type === 'Receita' ? incomeTags : [];

    return (
        <>
            <div className="modal-overlay" onClick={handleClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h2>Criar Lançamento</h2>
                    <form className="modal-form" onSubmit={handleSave}>
                        {!type && (
                            <div className="type-selection">
                                <button id="expense-button" type="button" onClick={() => setType('Despesa')}>Despesa</button>
                                <button id="income-button" type="button" onClick={() => setType('Receita')}>Receita</button>
                            </div>
                        )}
                        {type && (
                            <>
                                <div className="form-group">
                                    <label>Descrição</label>
                                    <input 
                                        type="text" 
                                        value={description} 
                                        onChange={handleDescriptionChange} 
                                        placeholder="Descrição do lançamento"
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
                                <div className="form-group">
                                    <label>Tag</label>
                                    <select
                                        value={selectedTag}
                                        onChange={(e) => setSelectedTag(e.target.value)}
                                    >
                                        <option value="">Selecione uma tag</option>
                                        {tags.map((tag, index) => (
                                            <option key={index} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="observation-button" 
                                        onClick={() => setShowObservationInput(prev => !prev)}
                                    >
                                        <FaCommentDots /> Observação
                                    </button>
                                </div>
                                <div className={`form-group observation-group ${showObservationInput ? 'show-observation' : ''}`}>
                                    <textarea 
                                        className="observation-input"
                                        value={observation} 
                                        onChange={handleObservationChange} 
                                        placeholder="Adicione uma observação"
                                    />
                                </div>
                                <div className="form-group-buttons">
                                    <button id="save-button" type="submit" disabled={isSubmitting}>Salvar</button>
                                    <button id="close-button" type="button" onClick={handleClose}>Cancelar</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

LaunchModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default LaunchModal;