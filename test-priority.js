require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const task = await prisma.task.create({
    data: { title: 'priority test', priority: 'High' },
  });
  console.log('Created task:', task);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);