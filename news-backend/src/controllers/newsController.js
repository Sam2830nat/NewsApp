const prisma = require('../config/db');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    const { category, keyword, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {
        status: 'PUBLISHED',
    };

    if (category) {
        where.categoryId = category;
    }

    if (keyword) {
        where.OR = [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
        ];
    }

    try {
        const articles = await prisma.article.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                author: { select: { name: true } },
            },
        });

        const total = await prisma.article.count({ where });

        res.json({
            articles,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single article
// @route   GET /api/news/:idOrSlug
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        if (!idOrSlug || idOrSlug === 'undefined' || idOrSlug === 'null') {
            return res.status(400).json({ message: 'Invalid article identifier' });
        }

        const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { id: idOrSlug } : { slug: idOrSlug };

        console.log('************************************************');
        console.log(`[V5_BACKEND] HIT: ${idOrSlug} | Query: ${JSON.stringify(query)}`);

        const article = await prisma.article.findFirst({
            where: query,
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true } },
            }
        });

        if (!article) {
            console.log(`[V5_BACKEND] Article NOT FOUND in DB: ${idOrSlug}`);
            return res.status(404).json({ message: 'Article not found' });
        }

        // Fetch comments independently - confirmed working via debug_db.js
        const allComments = await prisma.comment.findMany({
            where: { articleId: article.id },
            include: {
                user: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`[V5_BACKEND] DATABASE TRUTH: Found ${allComments.length} comments for article ${article.id}`);
        console.log('************************************************');

        // Structure comments into threaded format manually
        const rootComments = allComments.filter(c => !c.parentId || c.parentId === "" || c.parentId === null);
        const childComments = allComments.filter(c => c.parentId && c.parentId !== "" && c.parentId !== null);

        const structuredComments = rootComments.map(root => ({
            ...root,
            replies: childComments
                .filter(reply => String(reply.parentId) === String(root.id))
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        }));

        // Increment views safely in background
        try {
            prisma.article.update({
                where: { id: article.id },
                data: { views: { increment: 1 } }
            }).catch(e => console.error('[VIEW_INC] Error:', e.message));
        } catch (e) { }

        // Send structured response
        res.json({
            ...article,
            comments: structuredComments,
            debug_version: "v5-total-truth"
        });
    } catch (error) {
        console.error('[GET_ARTICLE] ERROR:', error);
        res.status(500).json({
            message: "Internal server error during article fetch",
            error: error.message,
            stack: error.stack,
            at: new Date().toISOString()
        });
    }
};

// @desc    Get personalized "For You" feed
// @route   GET /api/news/feed
// @access  Private
const getNewsFeed = async (req, res) => {
    try {
        // 1. Get user preferences
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const preferences = user.preferences || {};
        const preferredCategories = preferences.categories || []; // Array of Category IDs
        const preferredTopics = preferences.topics || []; // Array of strings

        // 2. Build query
        // Priority: Articles matching category OR matching topic in title/tags
        const where = {
            status: 'PUBLISHED',
            OR: []
        };

        if (preferredCategories.length > 0) {
            where.OR.push({ categoryId: { in: preferredCategories } });
        }

        if (preferredTopics.length > 0) {
            where.OR.push({ tags: { hasSome: preferredTopics } });
            // Also check title? Prisma MongoDB 'contains' might be expensive with ORs but let's add valid logic
            preferredTopics.forEach(topic => {
                where.OR.push({ title: { contains: topic, mode: 'insensitive' } });
            });
        }

        // If no preferences, fallback to latest news
        if (where.OR.length === 0) {
            delete where.OR;
        }

        const articles = await prisma.article.findMany({
            where,
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                author: { select: { name: true } }
            }
        });

        res.json(articles);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
    const { title, content, image, categoryId, tags, status } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    try {
        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                image,
                category: { connect: { id: categoryId } },
                author: { connect: { id: req.user.id } },
                tags: tags || [],
                status: status || 'DRAFT',
            },
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
    const { title, content, categoryId, tags, status, image } = req.body;

    try {
        const article = await prisma.article.findUnique({ where: { id: req.params.id } });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const updatedArticle = await prisma.article.update({
            where: { id: req.params.id },
            data: {
                title: title || article.title,
                content: content || article.content,
                image: image || article.image,
                categoryId: categoryId || article.categoryId,
                tags: tags || article.tags,
                status: status || article.status,
            },
        });

        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
    try {
        await prisma.article.delete({ where: { id: req.params.id } });
        res.json({ message: 'Article removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNews,
    getNewsById,
    getNewsFeed,
    createNews,
    updateNews,
    deleteNews,
};
