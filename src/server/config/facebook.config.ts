import { registerAs } from '@nestjs/config';

export default registerAs('facebook', () => ({
  clientID: process.env.OAUTH_FACEBOOK_ID,
  clientSecret: process.env.OAUTH_FACEBOOK_SECRET,
}));
