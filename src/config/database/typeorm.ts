import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

require('dotenv').config();

export const typeormConfig: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    seeds: ['dist/seeds/**/*{.ts,.js}'],
    factories: ['dist/factories/**/*.js'],
    seedTracking: true,
    logging: 'all',
    synchronize: false,
    cache: {
        type: "database",
        tableName: "query-result-cache",
    },
};

const datasource = new DataSource(typeormConfig);
export default datasource;
