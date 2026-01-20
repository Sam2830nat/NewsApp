const prisma = require('../config/db');

// @desc    Add a comment to an article
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
    const { content, articleId, parentId } = req.body;

    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // If parentId is provided, verify it exists
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                article: { connect: { id: articleId } },
                user: { connect: { id: req.user.id } },
                parent: parentId ? { connect: { id: parentId } } : undefined,
            },
            include: {
                user: { select: { name: true } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: req.params.id },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is owner or admin
        if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Delete comment (Replied comments might be deleted via Cascade in relational DB, but in Mongo/Prisma we might need to handle this manually or rely on Prisma relation actions if configured in schema.
        // In our schema: onDelete: NoAction. So we should probably check if it has children?
        // For simplicity, let's delete it. If it has children, those children reference a non-existent parent.
        // Ideally we should delete children too.

        // Deleting all replies first
        await prisma.comment.deleteMany({
            where: { parentId: req.params.id }
        });

        await prisma.comment.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addComment,
    deleteComment,
};
