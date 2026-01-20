const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Seed Categories
    const categories = ['Technology', 'Business', 'Sports', 'Health', 'Entertainment'];
    const categoryMap = {};

    for (const catName of categories) {
        const category = await prisma.category.upsert({
            where: { name: catName },
            update: {},
            create: { name: catName },
        });
        categoryMap[catName] = category.id;
        console.log(`Category ${catName} created.`);
    }

    // 2. Fetch or Create Admin User
    const adminEmail = 'n@ww.com';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('12345678', salt);
        admin = await prisma.user.create({
            data: {
                name: 'Natan Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
    }

    // 3. Seed 4 News Articles
    const newsData = [
        {
            title: 'The Future of AI in 2026',
            slug: 'future-of-ai-2026',
            content: 'Artificial Intelligence is evolving faster than ever. In this article, we explore how generative models are reshaping the workforce and personal productivity tools across the globe.',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
            category: 'Technology',
            tags: ['AI', 'Tech', 'Future'],
        },
        {
            title: 'Global Markets Show Resilience',
            slug: 'global-markets-resilience',
            content: 'Despite economic headwinds, global stock markets have shown remarkable resilience this quarter. Analysts point to strong tech earnings and stabilizing inflation as key drivers.',
            image: 'https://images.unsplash.com/photo-1611974717482-98252c00edee',
            category: 'Business',
            tags: ['Stocks', 'Economy', 'Finance'],
        },
        {
            title: 'New Health Breakthrough in Gene Therapy',
            slug: 'health-breakthrough-gene-therapy',
            content: 'Scientists have announced a major breakthrough in CRISPR technology, potentially leading to cures for several rare genetic disorders within the next decade.',
            image: 'https://images.unsplash.com/photo-1579163465015-3a9920d0469b',
            category: 'Health',
            tags: ['Health', 'Science', 'DNA'],
        },
        {
            title: 'SpaceX Mission to Mars Updates',
            slug: 'spacex-mars-mission-2026',
            content: 'SpaceX has provided a new timeline for its Starship Mars mission. The latest tests suggest that uncrewed landings could begin as early as late 2026.',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9',
            category: 'Technology',
            tags: ['Space', 'Mars', 'SpaceX'],
        }
    ];

    for (const item of newsData) {
        // Check if article already exists by slug
        // Using findFirst as a fallback if findUnique with slug complains before generate
        let article = await prisma.article.findFirst({ where: { slug: item.slug } });

        if (!article) {
            article = await prisma.article.create({
                data: {
                    title: item.title,
                    slug: item.slug,
                    content: item.content,
                    image: item.image,
                    categoryId: categoryMap[item.category],
                    authorId: admin.id,
                    status: 'PUBLISHED',
                    tags: item.tags,
                },
            });
            console.log(`Article "${item.title}" created.`);

            // 4. Seed Comments for each article
            await prisma.comment.create({
                data: {
                    content: `Very interesting piece on ${item.category}!`,
                    articleId: article.id,
                    userId: admin.id,
                }
            });
            console.log(`Comment added to article: ${item.title}`);
        } else {
            console.log(`Article "${item.title}" already exists.`);
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
