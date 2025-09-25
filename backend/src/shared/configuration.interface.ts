export interface IConfig {
  port: number | string;
  roundDuration: number;
  coolDownDuration: number;
  environment: string;
  jwt: {
    secret: string;
    expiration: string;
  };
}
