const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log('Starting connectivity test...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'UNDEFINED');
    try {
        await prisma.$connect();
        console.log('Successfully connected to MongoDB!');
        const usersCount = await prisma.user.count();
        console.log(`Current users in DB: ${usersCount}`);
    } catch (err) {
        console.error('ERROR during connection or query:');
        console.error(err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
