const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'allroles@eshop.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$PAZHZvm2Q/xYSlV2OckeGQ$0ldiCe8ngt45Dh43Iabns3bypfX6VTMP5LimFS9KBdA',
      firstname: 'Yassine',
      lastname: 'Tiatro',
      address: '9 RUE MAURICE ROY',
      roles: ['CLIENT', 'SELLER', 'ADMIN'],
      isActive: true,
      cart: { create: {} },
    },
  });
  await prisma.user.create({
    data: {
      email: 'client@eshop.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$Eiv3bcgE4y54v+GLFdivUg$e4qgCRDZd1NxZJYdjeZL5zlfc7Kng7wTqOnby5YNrnk',
      firstname: 'Aymane',
      lastname: 'Kabba',
      address: '74 Rue de Turly',
      roles: ['CLIENT'],
      cart: { create: {} },
    },
  });
  await prisma.product.createMany({
    data: [
      {
        picture: 'none.jpeg',
        name: 'Play5',
        price: 600,
        stock: 124,
      },
      {
        picture: 'none.jpeg',
        name: 'Iphone 16',
        price: 1100,
        stock: 163,
      },
    ],
  });
}

main()
  .then(() => console.log('Database seeded successfully!'))
  .catch((e) => console.error('Error seeding the database:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
