import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Connected successfully to DB");
    } catch (error) {
        console.error("❌ Failed to connect:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
