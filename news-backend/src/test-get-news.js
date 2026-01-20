require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const articleId = '696f46ea4e25fea9c6514bd8'; // From user's error log
    console.log(`Testing fetch for article ID: ${articleId}`);

    try {
        const article = await prisma.article.findFirst({
            where: { id: articleId },
            include: {
                category: true,
                author: {
                    select: { id: true, name: true, email: true }
                },
                comments: {
                    where: { parentId: null },
                    include: {
                        user: { select: { id: true, name: true } },
                        replies: {
                            include: {
                                user: { select: { id: true, name: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (article) {
            console.log('Article found:', article.title);
            console.log('Attempting to update views...');
            const updated = await prisma.article.update({
                where: { id: article.id },
                data: { views: { increment: 1 } }
            });
            console.log('Update successful, views:', updated.views);
        } else {
            console.log('Article not found (404 simulation)');
        }
    } catch (error) {
        console.error('CAUGHT ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
