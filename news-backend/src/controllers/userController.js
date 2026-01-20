const prisma = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            preferences: true,
            createdAt: true
        }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile & preferences
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (user) {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name: req.body.name || user.name,
                email: req.body.email || user.email,
                preferences: req.body.preferences || user.preferences // Expecting object with categories, topics
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                preferences: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
    res.json(users);
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUsers,
};
