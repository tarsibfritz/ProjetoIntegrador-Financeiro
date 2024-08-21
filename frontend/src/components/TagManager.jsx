import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        // Carregar as tags existentes do banco de dados
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tags');
                setTags(response.data);
            } catch (error) {
                toast.error("Erro ao carregar tags.");
            }
        };
        fetchTags();
    }, []);

    const handleAddTag = async () => {
        if (newTag.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:3000/api/tags', { name: newTag });
            setTags([...tags, response.data]);
            setNewTag('');
            toast.success("Tag adicionada com sucesso!");
        } catch (error) {
            toast.error("Erro ao adicionar tag.");
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/tags/${id}`);
            setTags(tags.filter(tag => tag.id !== id));
            toast.info("Tag removida.");
        } catch (error) {
            toast.error("Erro ao remover tag.");
        }
    };

    return (
        <div>
            <h2>Gerenciar Tags</h2>
            <input 
                type="text" 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                placeholder="Nova Tag"
            />
            <button onClick={handleAddTag}>Adicionar</button>
            <ul>
                {tags.map(tag => (
                    <li key={tag.id}>
                        {tag.name} 
                        <button onClick={() => handleDeleteTag(tag.id)}>Remover</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TagManager;