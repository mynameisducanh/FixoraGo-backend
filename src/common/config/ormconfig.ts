import * as dotenv from 'dotenv';
dotenv.config();

const ormconfig = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: false,
  maxQueryExecutionTime: 300,
  entities: [
    'dist/database/entities/*.entity{.ts,.js}',
    'dist/entities/*.entity{.ts,.js}',
  ],
  migrations: ['dist/database/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migration',
  },
};

export = ormconfig;
