import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  apiKey: process.env.STRIPE_SECRET_KEY,
  apiVersion: process.env.STRIPE_API_VERSION,
}));
