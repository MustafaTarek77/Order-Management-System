import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  //User 1
  await prisma.user.create({
    data: {
      name: 'Mustafa',
      email: 'mus@gmail.com',
      password: 'pass',
      address: 'maadi',
      description: 'CMP student',
    },
  });
  //User 2
  await prisma.user.create({
    data: {
      name: 'karim',
      email: 'karim@gmail.com',
      password: 'kkkk',
      address: 'giza',
      description: 'MECH student',
    },
  });

  //Product 1
  await prisma.product.create({
    data: {
      name: 'pepsi',
      description: 'soft drink',
      price: 15,
      stock: 25,
    },
  });

  //Product 2
  await prisma.product.create({
    data: {
      name: 'chepsi',
      description: 'food',
      price: 5,
      stock: 88,
    },
  });

  //Product 3
  await prisma.product.create({
    data: {
      name: 'squeeze',
      description: 'ice cream',
      price: 10,
      stock: 10,
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
