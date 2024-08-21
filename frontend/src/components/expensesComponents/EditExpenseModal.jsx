import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCommentDots, FaTag, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import "../../styles/EditExpenseModal.css";

const EditExpenseModal = ({ isOpen, onClose, onUpdateExpense, expense }) => {
    const [description, setDescription] = useState(expense.description || '');
    const [amount, setAmount] = useState(expense.amount || '');
    const [date, setDate] = useState(expense.date ? new Date(expense.date).toISOString().split('T')[0] : '');
    const [observation, setObservation] = useState(expense.observation || '');
    const [tags, setTags] = useState(expense.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [showObservationInput, setShowObservationInput] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);

    useEffect(() => {
        setDescription(expense.description || '');
        setAmount(expense.amount || '');
        setDate(expense.date ? new Date(expense.date).toISOString().split('T')[0] : '');
        setObservation(expense.observation || '');
        setTags(expense.tags || []);
    }, [expense]);

    const handleAddTag = () => {
        if (tagInput) {
            if (tags.includes(tagInput)) {
                toast.warning("Tag já adicionada!");
            } else {
                setTags([...tags, tagInput]);
                setTagInput('');
                toast.success("Tag adicionada com sucesso!");
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
        toast.info("Tag removida.");
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSave = async () => {
        if (!description || !amount || !date) {
            toast.error("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const updatedExpense = {
            ...expense,
            description,
            amount: parseFloat(amount),
            date: new Date(date).toISOString(),
            observation,
            tags
        };

        try {
            await axios.put(`http://localhost:3000/api/expenses/${expense.id}`, updatedExpense);
            toast.success("Despesa atualizada com sucesso!");
            onUpdateExpense(updatedExpense);
            onClose();
        } catch (error) {
            toast.error("Erro ao atualizar despesa.");
            console.error('Erro ao atualizar despesa:', error);
        }
    };

    return (
        isOpen && (
            <div className="edit-expense-modal-overlay">
                <div className="edit-expense-modal-content">
                    <button className="edit-expense-close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                    <h2 className="edit-expense-heading">Editar Despesa</h2>
                    <form className="edit-expense-form">
                        <label>
                            Descrição:
                            <input 
                                type="text" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </label>
                        <label>
                            Valor:
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                step="0.01" 
                            />
                        </label>
                        <label>
                            Data:
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </label>
                        {showObservationInput ? (
                            <label>
                                Observação:
                                <textarea 
                                    value={observation} 
                                    onChange={(e) => setObservation(e.target.value)} 
                                />
                            </label>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setShowObservationInput(true)}
                            >
                                <FaCommentDots /> Adicionar Observação
                            </button>
                        )}
                        {showTagInput ? (
                            <div>
                                <label>
                                    Tags:
                                    <input 
                                        type="text" 
                                        value={tagInput} 
                                        onChange={(e) => setTagInput(e.target.value)} 
                                        onKeyDown={handleTagInputKeyDown}
                                    />
                                </label>
                                <button type="button" onClick={handleAddTag}>Adicionar Tag</button>
                                <div>
                                    {tags.map((tag, index) => (
                                        <span key={index} className="edit-expense-tag">
                                            {tag}
                                            <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setShowTagInput(true)}
                            >
                                <FaTag /> Adicionar Tag
                            </button>
                        )}
                        <button 
                            type="button" 
                            className="edit-expense-save-button" 
                            onClick={handleSave}
                        >
                            Salvar
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

EditExpenseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateExpense: PropTypes.func.isRequired,
    expense: PropTypes.object.isRequired
};

export default EditExpenseModal;