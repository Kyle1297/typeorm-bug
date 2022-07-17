import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientID: process.env.OAUTH_GOOGLE_ID,
  clientSecret: process.env.OAUTH_GOOGLE_SECRET,
}));
