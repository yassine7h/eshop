const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: 'allroles@eshop.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$PAZHZvm2Q/xYSlV2OckeGQ$0ldiCe8ngt45Dh43Iabns3bypfX6VTMP5LimFS9KBdA',
        firstname: 'Yassine',
        lastname: 'Tiatro',
        address: '9 RUE MAURICE ROY',
        roles: ['CLIENT', 'SELLER', 'ADMIN'],
      },
      {
        id: 2,
        email: 'client@eshop.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$Eiv3bcgE4y54v+GLFdivUg$e4qgCRDZd1NxZJYdjeZL5zlfc7Kng7wTqOnby5YNrnk',
        firstname: 'Aymane',
        lastname: 'Kabba',
        address: '74 Rue de Turly',
        roles: ['CLIENT'],
      },
    ],
  });

  await prisma.cart.createMany({
    data: [
      { id: 1, userId: 1 },
      { id: 2, userId: 2 },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        id: 1,
        picture: 'none.jpeg',
        name: 'Play5',
        price: 600,
        stock: 124,
      },
      {
        id: 2,
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
