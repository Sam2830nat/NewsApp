const prisma = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const categoryExists = await prisma.category.findUnique({
            where: { name },
        });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await prisma.category.create({
            data: { name },
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        await prisma.category.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
};
