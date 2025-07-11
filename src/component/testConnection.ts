import { resolve } from 'path';
import { Connection, createConnection, getRepository } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Organisation } from '../entity/organisation';
import { Profile } from '../entity/profile';
import { Result } from '../entity/result';
import { APPLICATION_NAME, CONFIG } from './constant';

const config = {
    db: {
        url: 'postgresql://dummy:dummy@localhost:5432/services',
        dbname: 'services',
        schema: 'test'
    }
};
const dbConfig: PostgresConnectionOptions = {
    url: config.db.url,
    extra: {
        application_name: APPLICATION_NAME,
    },
    synchronize: false,
    dropSchema: true,
    entities: [
        `${resolve(__dirname, '../entity')}/**.{js,ts}`
    ],
    migrations: [
        `${resolve(__dirname, '../migration')}/**.{js,ts}`
    ],
    subscribers: [
        `${resolve(__dirname, '../subscriber')}/**.{js,ts}`
    ],
    cli: {
        'entitiesDir': resolve(__dirname, '../entity'),
        'migrationsDir': resolve(__dirname, '../migration'),
        'subscribersDir': resolve(__dirname, '../subscriber'),
    },
    cache: false,
    type: 'postgres',
    schema: CONFIG.db.schema,
    maxQueryExecutionTime: 200,
};

export async function initialiseDB(): Promise<Connection> {
    const connection = await createConnection(dbConfig);
    await connection.createQueryRunner('master').createSchema(CONFIG.db.schema, true);
    await connection.runMigrations({ transaction: 'each' });
    return connection;
}

export async function importData(): Promise<void> {
    const orgRepo = getRepository(Organisation);
    const profileRepo = getRepository(Profile);
    const resultRepo = getRepository(Result);

    try {
        const org = await orgRepo.findOneOrFail({ where: { name: 'Circle' } });

        for (let i = 0; i < 3; i++) {
            const profile = await profileRepo.save(profileRepo.create({
                name: 'James Yip',
                organisation: org
            }));

            for (let b = 0; b < 10; b++) {
                await resultRepo.save(resultRepo.create({
                    sampleId: '123456',
                    activateTime: new Date(),
                    resultTime: new Date(),
                    profile: profile
                }));
            }
        }
    } catch (err) {
        console.log(err);
    }
}
