const Block = require("../models/Block");

const getBlocks = async (req, res) => {
    try {
        const blocks = await Block.findAll();
        res.status(200).json(blocks);
    } catch (error) {
        console.error("Error fetching blocks:", error);
        res.status(500).json({ message: "Ошибка при получении данных", error: error.message });
    }
};

const createBlock = async (req, res) => {
    try {
        const { photoURL, email, text, rightText1, rightText2 } = req.body;

        if (!photoURL || !email || !text || !rightText1 || !rightText2) {
            return res.status(400).json({ message: "Пожалуйста, заполните все поля." });
        }

        const newBlock = await Block.create({
            photoURL,
            email,
            text,
            rightText1,
            rightText2,
        });

        res.status(201).json(newBlock);
    } catch (error) {
        console.error("Error creating block:", error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ message: "Ошибка валидации данных", errors: errors });
        }

        res.status(500).json({ message: "Ошибка при создании записи", error: error.message });
    }
};


module.exports = {
    getBlocks,
    createBlock,
};
