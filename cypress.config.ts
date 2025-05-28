import { defineConfig } from 'cypress';
import { PrismaClient } from '@prisma/client';
import { hash } from './lib/encrypt';

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        async 'db:reset'() {
          // Delete carts with null userId
          await prisma.cart.deleteMany({
            where: {
              userId: null,
            },
          });

          // Delete all carts for the test user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: 'testCypressUser@example.com',
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: 'testCypressUser@example.com',
            },
          });

          return null;
        },
        async 'db:seed'() {
          return null;
        },
        async 'db:cleanup'() {
          // Delete carts with null userId
          await prisma.cart.deleteMany({
            where: {
              userId: null,
            },
          });

          // Delete all carts for the test user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: 'testCypressUser@example.com',
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: 'testCypressUser@example.com',
            },
          });

          await prisma.$disconnect();
          return null;
        },
        async 'db:createUser'() {
          const hashedPassword = await hash('123456');
          const user = await prisma.user.upsert({
            where: { email: 'testCypressUser@example.com' },
            update: {
              name: 'Cypress User',
              password: hashedPassword,
            },
            create: {
              email: 'testCypressUser@example.com',
              name: 'Cypress User',
              password: hashedPassword,
              role: 'user',
              image: null,
              address: {},
              emailVerified: null,
              paymentMethod: null,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      });
    },
    baseUrl: 'http://localhost:3000/',
  },
});
