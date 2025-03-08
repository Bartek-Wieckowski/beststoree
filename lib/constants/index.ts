const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'bestStoree';
const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern ecommerce platfrom';
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

 const signInDefaultValues = {
  email: 'admin@example.com',
  password: '123456',
};

export { APP_NAME, APP_DESCRIPTION, SERVER_URL, LATEST_PRODUCTS_LIMIT, signInDefaultValues };
