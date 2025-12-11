import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log('Database Config - Host:', process.env.DB_HOST);
console.log('Database Config - User:', process.env.DB_USER);
console.log('Database Config - Database:', process.env.DB_NAME);

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
};
