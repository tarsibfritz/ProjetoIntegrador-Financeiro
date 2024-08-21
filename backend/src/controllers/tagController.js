const db = require('../models/index');
const Tag = db.Tag;

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: 'O nome da tag é obrigatório.' });
        }

        const newTag = await Tag.create({ name });
        return res.status(201).json(newTag);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar tag.' });
    }
};

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar tags.' });
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: 'O nome da tag é obrigatório.' });
        }

        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada.' });
        }

        tag.name = name;
        await tag.save();

        return res.status(200).json(tag);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar tag.' });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada.' });
        }

        await tag.destroy();
        return res.status(204).send(); // Status 204 para exclusão bem-sucedida
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao remover tag.' });
    }
};