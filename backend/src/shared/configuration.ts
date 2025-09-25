import { IConfig } from './configuration.interface';

const coolDownDuration = process.env.COOL_DOWN_DURATION;
const roundDuration = process.env.ROUND_DURATION;
export default (): IConfig => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8030,
  coolDownDuration:
    coolDownDuration && !Number.isNaN(+coolDownDuration)
      ? +coolDownDuration
      : 60,
  roundDuration:
    roundDuration && !Number.isNaN(+roundDuration) ? +roundDuration : 60,

  jwt: {
    secret: process.env.JWT_SECRET || 'fdnksnfdngnksgf',
    expiration: process.env.JWT_EXPIRATION || '10min',
  },
});
