const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    console.log('--- DATABASE DIAGNOSTIC START ---');
    const articleId = '696f46ea4e25fea9c6514bd8';

    // 1. Check Article
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    console.log('Article Found:', article ? article.title : 'NOT FOUND');

    // 2. Check ALL Comments in DB
    const totalCount = await prisma.comment.count();
    console.log('Total Comments in DB:', totalCount);

    // 3. Check Comments for THIS Article
    const directComments = await prisma.comment.findMany({
        where: { articleId: articleId }
    });
    console.log(`Direct fetch by articleId "${articleId}" found:`, directComments.length);

    // 4. If 0, list all unique articleIds in the Comment collection
    if (directComments.length === 0 && totalCount > 0) {
        const allComments = await prisma.comment.findMany({ select: { articleId: true, content: true } });
        const uniqueIds = [...new Set(allComments.map(c => c.articleId))];
        console.log('Unique articleIds found in existing comments:', uniqueIds);
        console.log('Sample content of first comment:', allComments[0].content);
    }

    console.log('--- DIAGNOSTIC END ---');
    await prisma.$disconnect();
}

debug().catch(console.error);
